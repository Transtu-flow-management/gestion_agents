import { Component, OnInit, ViewChild } from '@angular/core';
import { Conductor } from '../../Models/Conductor';
import { ConductorService } from '../../Services/conductor.service';
import { MatDialog } from '@angular/material/dialog';
import { AddConductorComponent } from 'src/app/Dialogs/add-conductor/add-conductor.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { MatTable } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UpdateConductorComponent } from 'src/app/Dialogs/update-conductor/update-conductor.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { error } from 'jquery';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { AuthService } from '../../Services/auth.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-conductors',
  templateUrl: './conductors.component.html',
  styleUrls: ['./conductors.component.css']
})
export class ConductorsComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<Conductor>;
  conductors: Conductor[] = [];
  filteredconductor: Conductor[] = [];
  totalPages: number;
  totalElements: number;
  searchResults: Conductor[] = [];
  term: string = '';
  currentPage = 0;
  currentagent :number =0;
  pageSize = 2;
  isButtonDisabled= false;
  pageSizeOptions: number[] = [5, 10, 20,50];
    isfilterclicked=false;
  filterValue: string = ''
  dateFilter = new FormControl(null);
userinfo:any;
currentOrder = { field: 'name', direction: 'asc' }; 
  
  constructor(private _conductorservice: ConductorService,private authserv:AuthService,private gs:GlobalService,
    private dialog: MatDialog,
    private snackBar:MatSnackBar) {
      this.pageSize = this.pageSizeOptions[0]

  }

  ngOnInit(): void {
    this.userinfo = this.gs.getUserDetails();
    this.currentagent = this.userinfo.id;
    this.fetchConductors(this.currentPage, this.pageSize,this.currentagent);
  }
 
  fetchConductors(page: number, pageSize: number,agentId:number) {
    if (this.filteredconductor && this.filteredconductor.length > 0) {
      this.conductors = this.filteredconductor.slice(page * this.pageSize, (page + 1) * this.pageSize);
      this.totalElements = this.filteredconductor.length;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    }else  if (this.searchResults && this.searchResults.length > 0) {
      this.conductors = this.searchResults.slice(page * this.pageSize, (page + 1) * this.pageSize);
      this.totalElements = this.searchResults.length;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    }  
    else {
      this._conductorservice.getconductors(page, pageSize,agentId).subscribe(
        (conductors: any) => {
          this.conductors = conductors.content;
          this.totalElements = conductors.totalElements;
          this.totalPages = conductors.totalPages;
        },
        (error) => {
          console.log('Error getting conductors:', error);
        }
      );
    }
  }
  applyDateFilter() {
    const filterDate: Date = this.dateFilter.value;
    const year: number = filterDate.getFullYear();
    const month: number = filterDate.getMonth() + 1;
    const day: number = filterDate.getDate();
    const formattedDate: string = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    this._conductorservice.getfilteredDate(new Date(formattedDate)).subscribe((res) => {
      this.filteredconductor = res;
      this.totalElements = this.filteredconductor.length;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);
      this.fetchConductors(this.currentPage, this.pageSize,this.currentagent);
    })
  }
  searchAgent(query: String) {
    this._conductorservice.searchagent(query).subscribe((res) => {
      this.searchResults = res;
      this.currentPage = 0;
      this.totalElements = this.searchResults.length;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);
      this.fetchConductors(this.currentPage, this.pageSize,this.currentagent);
      console.log(this.term);

    }, (error) => {
      console.log("error searching for conductor", error);
    })
  }
  enableButton(){
    this.isButtonDisabled = false;
  }


  getDatePickerValue(): void { 
    this.isButtonDisabled = false;
    this.isfilterclicked=true;
    if (this.dateFilter.value=== null){
    console.log(null);
    }else{
    this.applyDateFilter();
    this.isButtonDisabled= true;
  }
  }
  sortByName() {
    this.currentOrder.field = 'name';
       this.currentOrder.direction = (this.currentOrder.direction === 'asc') ? 'desc' : 'asc';
         this._conductorservice.getconductorsSorted(this.currentPage, this.pageSize,this.currentagent).subscribe((res: any) => {
          this.conductors = res.content;
          this.totalElements = res.totalElements;
          this.totalPages = res.totalPages;
         }, (error) => {
           console.log("error getting agent pages", error);
         });
       
     }
  openAddConductorDialog() {
    const dialogref = this.dialog.open(AddConductorComponent, {
      height: '60%',
      width: '50%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '200ms',
    })
    dialogref.afterClosed().subscribe(()=>{
this.currentPage =0;
this.fetchConductors(this.currentPage,this.pageSize, this.currentagent);
    })
  }
  openEditConductorDialog(conductor: Conductor) { 
    let dialogref = this.dialog.open(UpdateConductorComponent,{
      height:'60%',
      width:'70%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'200ms',
      data :{ conductor:conductor},
    });
    dialogref.afterClosed().subscribe(()=>{
      this.currentPage =0;
      this.fetchConductors(this.currentPage,this.pageSize,this.currentagent);
          })
  }
  hasAuthority(auth:string):boolean{
    if(this.authserv.hasAuthority(auth)){
      return true;
    }
    return false;
  }
  openDelToast(message: string) {
    this.snackBar.openFromComponent(SuccessToastComponent, {
      data: { message: message },
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: ['snack-green', 'snack-size', 'snack-position']
    })
  }
  openfailToast(message: string): void {
    this.snackBar.openFromComponent(FailedToastComponent, {
      data: { message: message }, duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "bottom",
      panelClass: ['snack-red', 'snack-size']
    });
  }
  deleteConductor(id: number) {
    const message = "Effacer le Conducteur?";
    const title = "Delete Conductor"
    const deletedialog = this.dialog.open(ConfirmationComponent, {
      data: { message: message, title: title },
    });
    deletedialog.afterClosed().subscribe((res) => {
      if (res == 'confirm')
        this._conductorservice.deleteConductor(id).subscribe(()=>{
            this.openDelToast("Conducteur a ete supprimé avec success");
            this.conductors = this.conductors.filter(conductor => conductor.id !== id);
            if (this.conductors.length === 0) {
              this.currentPage = this.currentPage -1
              if (this.currentPage < 0) {
                this.currentPage = 0;
              }
              this.fetchConductors(this.currentPage, this.pageSize,this.currentagent);
            }
        },()=>{
          this.openfailToast("Erreur l\'ors de supprission");
        }
        )

    })
  }
  

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchConductors(this.currentPage - 1, this.pageSize,this.currentagent);
    console.log(this.currentPage)
  }

  onPageSizeChange(value :number):void{
    this.pageSize = value;
    this.fetchConductors(this.currentPage,this.pageSize,this.currentagent);
  }

}
