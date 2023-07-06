import { Component, OnInit, ViewChild } from '@angular/core';
import { Conductor } from '../../interfaces/Conductor';
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
  term: string = '';
  currentPage = 0;
  pageSize = 2;
  isButtonDisabled= false;
  pageSizeOptions: number[] = [5, 10, 20];
  isfilterclicked=false;
  filterValue: string = ''
  dateFilter = new FormControl(null);
  
  constructor(private _conductorservice: ConductorService, 
    private dialog: MatDialog,
    private snackBar:MatSnackBar) {
      this.pageSize = this.pageSizeOptions[0]

  }

  ngOnInit(): void {
    this.fetchConductors(this.currentPage, this.pageSize)
  }
 
  fetchConductors(page: number, pageSize: number) {
    if (this.filteredconductor && this.filteredconductor.length > 0) {
      this.conductors = this.filteredconductor.slice(page * this.pageSize, (page + 1) * this.pageSize);
      this.totalElements = this.filteredconductor.length;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    } else {
      this._conductorservice.getconductors(page, pageSize).subscribe(
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
      this.fetchConductors(this.currentPage, this.pageSize);
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
  openAddConductorDialog() {
    const dialogref = this.dialog.open(AddConductorComponent, {
      height: '60%',
      width: '50%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '200ms',
    })
    dialogref.afterClosed().subscribe(()=>{
this.currentPage =0;
this.fetchConductors(this.currentPage,this.pageSize);
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
              this.fetchConductors(this.currentPage, this.pageSize);
            }
        },()=>{
          this.openfailToast("Erreur l\'ors de supprission");
        }
        )

    })
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchConductors(this.currentPage - 1, this.pageSize);
    console.log(this.currentPage)
  }

  onPageSizeChange(value :number):void{
    this.pageSize = value;
    this.fetchConductors(this.currentPage,this.pageSize);
  }

}
