import { Component, OnInit, ViewChild } from '@angular/core';
import { Conductor } from '../../interfaces/Conductor';
import { ConductorService } from '../../Services/conductor.service';
import { MatDialog } from '@angular/material/dialog';
import { AddConductorComponent } from 'src/app/Dialogs/add-conductor/add-conductor.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { error } from 'jquery';
@Component({
  selector: 'app-conductors',
  templateUrl: './conductors.component.html',
  styleUrls: ['./conductors.component.css']
})
export class ConductorsComponent implements OnInit {
  conductors: Conductor[] = [];
  filteredconductor: Conductor[] = [];
  totalPages: number;
  totalElements: number;
  term :string = '';
  currentPage = 0;
  pageSize = 2;
  dateFilterControl = new FormControl(null);

  //dataSource: MatTableDataSource<any>;
 // displayedColumns: string[] = ['id', 'name', 'uid', 'dateOfInsertion', 'dateOfModification', 'actions'];
  filterValue :string =''
  constructor(private _conductorservice: ConductorService,private dialog: MatDialog) { 

  }

  ngOnInit(): void {
    this.fetchconductors(this.currentPage,this.pageSize)
  }
  fetchconductors(page: number, pagesize: number) { 
    const filterDate = this.dateFilterControl.value;
    if (filterDate) {
      this._conductorservice.getconductors(0, this.totalElements).subscribe(
        (conductors: any) => {
          this.conductors = conductors.content;
          this.filteredconductor = this.applyDateFilter(this.conductors, filterDate);
          this.totalElements = this.filteredconductor.length;
          this.totalPages = Math.ceil(this.totalElements / this.pageSize);
          this.conductors = this.filteredconductor.slice(page * pagesize, (page + 1) * pagesize);
        },
        (error) => {
          console.log("error getting conductors:", error);
        }
      );
    } else {
      this._conductorservice.getconductors(page, pagesize).subscribe(
        (conductors: any) => {
          this.conductors = conductors.content;
          this.filteredconductor = this.conductors;
          this.totalElements = conductors.totalElements;
          this.totalPages = conductors.totalPages;
        },
        (error) => {
          console.log("error getting conductors:", error);
        }
      );
    }
  }

  
  applyDateFilter(conductors: any[], filterDate: Date): any[] {
    if (!filterDate) {
      return conductors;
    }
  
    const startOfDay = new Date(filterDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(filterDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const filteredConductors = conductors.filter((conductor) => {
      const conductorDate = new Date(conductor.dateOfInsertion);
      return conductorDate >= startOfDay && conductorDate <= endOfDay;
    });
    return filteredConductors;
  }
  
  applyfilterDate() {
    const filterDate = this.dateFilterControl.value;
    this.fetchconductors(this.currentPage, this.pageSize);
  }
  
  getDatePickerValue(): void {
    const dateValue = this.dateFilterControl.value;
    this.applyfilterDate();
    console.log('Date Picker Value:', dateValue);
  }
  openAddConductorDialog() { 
    const dialogref = this.dialog.open(AddConductorComponent,{
      height:'60%',
      width:'50%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'200ms',
    })
  }
  openEditConductorDialog(conductor: Conductor) { }
  deleteConductor(id: number) {
    const message = "Effacer le Conducteur?";
    const title = "Delete Conductor"
    const deletedialog = this.dialog.open(ConfirmationComponent,{
      data:{message:message,title:title},
    });
    deletedialog.afterClosed().subscribe((res)=>{
      if (res =='confirm')
this._conductorservice.deleteConductor(id).subscribe({
  next : (res)=> {
    alert('Conducteur supprimé');
    //return the new table with the deleted conductor
  },
})

    })
   }

  onPageChange(page :number){
    this.currentPage = page ;
    this.fetchconductors(this.currentPage-1,this.pageSize);
    console.log(this.currentPage)
  }



}
