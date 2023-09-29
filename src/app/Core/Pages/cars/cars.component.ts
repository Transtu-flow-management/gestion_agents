import { Component, OnInit } from '@angular/core';
import { Car } from '../../Models/Car';
import { CarService } from '../../Services/car.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCarComponent } from 'src/app/Dialogs/add-car/add-car.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { UpdateCarComponent } from 'src/app/Dialogs/update-car/update-car.component';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit{

  Cars:Car[] = [];
  totalPages: number;
  totalElements: number;
  term: string = '';
  currentPage = 0;
  pageSize = 5;
  userinfo:any;
  currentagent :number =0;
  isButtonDisabled= false;
  currentOrder = { field: 'matricule', direction: 'asc' }; 

  pageSizeOptions: number[] = [5, 10, 20];
  constructor(private _carservice:CarService,private dialog:MatDialog,private snackbar:MatSnackBar,private gs:GlobalService){}

  ngOnInit(): void {
    this.userinfo = this.gs.getUserDetails();
    this.currentagent = this.userinfo.id;
      this.fetchcars(this.currentPage,this.pageSize);
  }
  fetchcars(page: number, pageSize: number) {
    this._carservice.getCars(page, pageSize,this.currentagent).subscribe(
      (Cars: any) => {
        this.Cars = Cars.content.map((car: any) => {
          if (car.line === null) {
            car.line = { nameFr: 'Null' , nameAr:'Null' };
          }
          if (car.brand === null){
            car.brand = {name:'EMPTY'}
          }
         
          return car;
        });
        this.totalElements = Cars.totalElements;
        this.totalPages = Cars.totalPages;
      },
      (error) => {
        console.log('Error getting paths:', error);
      }
    );
  
}
sortByName() {
  this.currentOrder.field = 'matricule';
     this.currentOrder.direction = (this.currentOrder.direction === 'asc') ? 'desc' : 'asc';
       this._carservice.getCarsSorted(this.currentPage, this.pageSize,this.currentagent).subscribe((res: any) => {
         this.Cars = res.content;
         this.totalElements = res.totalElements;
         this.totalPages = res.totalPages;
       }, (error) => {
         console.log("error getting agent pages", error);
       });
   }

openDelToast(message: string) {
  this.snackbar.openFromComponent(SuccessToastComponent, {
    data: { message: message },
    duration: 5000,
    horizontalPosition: "end",
    verticalPosition: "top",
    panelClass: ['snack-green', 'snack-size', 'snack-position']
  })
}
openfailToast(message: string): void {
  this.snackbar.openFromComponent(FailedToastComponent, {
    data: { message: message }, duration: 5000,
    horizontalPosition: "end",
    verticalPosition: "bottom",
    panelClass: ['snack-red', 'snack-size']
  });
}

deletecar(id:string):void{
  const carToDelete = this.Cars.find(car => car.id === id);
  const message ='Supprimer Cette vehicule? '+`${carToDelete.matricule}`
  const title = 'Delete Car';
  const deletedialog = this.dialog.open(ConfirmationComponent, {
    data: { message: message, title: title },
  });
  deletedialog.afterClosed().subscribe((res) => {
    if (res == 'confirm')
      this._carservice.deletecar(id).subscribe(()=>{
          this.openDelToast("Vehicule a ete supprimé avec success");
          this.Cars = this.Cars.filter(line => line.id !== id);
          if (this.Cars.length === 0) {
            this.currentPage = this.currentPage -1
            if (this.currentPage < 0) {
              this.currentPage = 0;
            }
            this.fetchcars(this.currentPage, this.pageSize);
          }
      },()=>{
        this.openfailToast("Erreur l\'ors de supprission");
      }
      )

  })
}


  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchcars(this.currentPage - 1, this.pageSize);
  }

  onPageSizeChange(value :number):void{
    this.pageSize = value;
    this.fetchcars(this.currentPage,this.pageSize);
  }
   openAddCarDialog():void{
    const dialogref = this.dialog.open(AddCarComponent,{
      height: '90%',
      width: '50%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '200ms',
    });
    dialogref.afterClosed().subscribe(()=>{
      this.currentPage =0;
      this.fetchcars(this.currentPage,this.pageSize);
          });
  }
  openEditCar(car:Car):void{
    const dialogref =this.dialog.open(UpdateCarComponent,{
      height: '90%',
      width: '50%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '200ms',
      data:{car:car},
    });

  }

}
