import { Component,OnInit } from '@angular/core';
import { Lines } from '../../interfaces/Lines';
import { LinesService } from '../../Services/lines.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { AddLineComponent } from 'src/app/Dialogs/add-line/add-line.component';
import { UpdateLineComponent } from 'src/app/Dialogs/update-line/update-line.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.css']
})
export class LinesComponent implements OnInit{
  Lines: Lines[] = [];
  filteredlines: Lines[] = [];
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
  constructor(private _lineservice: LinesService, 
    private dialog: MatDialog,
    private snackBar:MatSnackBar) {
      this.pageSize = this.pageSizeOptions[0]
  }
  ngOnInit(): void {
    this.fetchlines(this.currentPage,this.pageSize);
      
  }
  fetchlines(page: number, pageSize: number) {
    if (this.filteredlines && this.filteredlines.length > 0) {
      this.Lines = this.filteredlines.slice(page * this.pageSize, (page + 1) * this.pageSize);
      this.totalElements = this.filteredlines.length;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    } else {
      this._lineservice.getlines(page, pageSize).subscribe(
        (lines: any) => {
          this.Lines = lines.content;
          this.totalElements = lines.totalElements;
          this.totalPages = lines.totalPages;
        },
        (error) => {
          console.log('Error getting conductors:', error);
        }
      );
    }
  }
  enableButton(){
    this.isButtonDisabled = false;
  }

  applyDateFilter() {
    const filterDate: Date = this.dateFilter.value;
    const year: number = filterDate.getFullYear();
    const month: number = filterDate.getMonth() + 1;
    const day: number = filterDate.getDate();
    const formattedDate: string = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    this._lineservice.getfilteredDate(new Date(formattedDate)).subscribe((res) => {
      this.filteredlines = res;
      this.totalElements = this.filteredlines.length;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);
      this.fetchlines(this.currentPage, this.pageSize);
    })
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
    const dialogref = this.dialog.open(AddLineComponent, {
      height: '90%',
      width: '50%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '200ms',
    })
    dialogref.afterClosed().subscribe(()=>{
this.currentPage =0;
this.fetchlines(this.currentPage,this.pageSize);
    })
  }
  openEditlineDialog(line: Lines) { 
    let dialogref = this.dialog.open(UpdateLineComponent,{
      height:'90%',
      width:'50%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'200ms',
      data :{ line:line},
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
  deleteLine(id: string) {
    const message = "Effacer le ligne?";
    const title = "Delete Line"
    const deletedialog = this.dialog.open(ConfirmationComponent, {
      data: { message: message, title: title },
    });
    deletedialog.afterClosed().subscribe((res) => {
      if (res == 'confirm')
        this._lineservice.deleteline(id).subscribe(()=>{
            this.openDelToast("Ligne a ete supprimé avec success");
            this.Lines = this.Lines.filter(line => line.id !== id);
            if (this.Lines.length === 0) {
              this.currentPage = this.currentPage -1
              if (this.currentPage < 0) {
                this.currentPage = 0;
              }
              this.fetchlines(this.currentPage, this.pageSize);
            }
        },()=>{
          this.openfailToast("Erreur l\'ors de supprission");
        }
        )

    })
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchlines(this.currentPage - 1, this.pageSize);
    console.log(this.currentPage)
  }

  onPageSizeChange(value :number):void{
    this.pageSize = value;
    this.fetchlines(this.currentPage,this.pageSize);
  }
}
