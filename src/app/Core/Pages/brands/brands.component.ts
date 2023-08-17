import { Component, OnInit } from '@angular/core';
import { Brand } from '../../Models/brand';
import { BrandService } from '../../Services/brand.service';
import { MatDialog } from '@angular/material/dialog';
import { AddBrandComponent } from 'src/app/Dialogs/add-brand/add-brand.component';
import { UpdateBrandComponent } from 'src/app/Dialogs/update-brand/update-brand.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { ErrorsComponent } from 'src/app/Dialogs/errors/errors.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {
  brands: Brand[] = [];
  currentPage = 0;
  pageSize = 5;
  totalAgents: number;
  totalPages: number;
  totalElements: number;
  pageSizeOptions: number[] = [5, 10, 20,50];

  constructor(private _brandservice: BrandService, private dialog: MatDialog, private snackbar: MatSnackBar) { }
  ngOnInit(): void {
    this.fetchBrands(this.currentPage,this.pageSize)
  }
  fetchBrands(page:number,size:number): void {
    this._brandservice.getAllbrands(page,size).subscribe((brand:any) => {
      this.brands = brand.content;
      this.totalElements = brand.totalElements;
      this.totalPages = brand.totalPages;
    }, (error) => {

      console.log(error)
    });
  }
  openAddbrandDialog(): void {
    const dialogref = this.dialog.open(AddBrandComponent, {
      height: '60%',
      width: '70%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '200ms',
    });
    dialogref.afterClosed().subscribe(result =>{
    
      if (result){
        this.brands.push(result);
      }
    })
  }
  openEditbrandDialog(brand: Brand) {
    let dialogref = this.dialog.open(UpdateBrandComponent, {
      height: '60%',
      width: '70%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '200ms',
      data: { brand: brand },

    });
  }
  deletebrand(id: string): void {
    const deldialog = this.dialog.open(ConfirmationComponent, {
      data: { message: 'delete brand' },
    });
    deldialog.afterClosed().subscribe((res) => {
      const message = 'la marque a été supprimé avec succes';
      if (res == 'confirm')
        this._brandservice.deletebrand(id).subscribe({
          next: (res) => {
            this.snackbar.openFromComponent(SuccessToastComponent, {
              data: { message: message },
              duration: 5000,
              horizontalPosition: "end",
              verticalPosition: "top",
              panelClass: ['snack-green', 'snack-size', 'snack-position']
            });
            this.brands = this.brands.filter(brand => brand.id !== id);      
          },
        })
    });
  }
  openfailToast(message: string, title: string) {
    this.dialog.open(ErrorsComponent, {
      data: { message: message, title: title },
    });
    this.dialog.afterOpened.subscribe(() => {
      setTimeout(() => 3000,)
    });
  }

  onPageSizeChange(value :number):void{
    this.pageSize = value;
    this.fetchBrands(this.currentPage,this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchBrands(this.currentPage -1 , this.pageSize);
  }
}
