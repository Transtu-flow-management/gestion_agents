import { Component } from '@angular/core';
import { AddLineComponent } from 'src/app/Dialogs/add-line/add-line.component';
import { UpdateLineComponent } from 'src/app/Dialogs/update-line/update-line.component';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { Path } from '../../interfaces/Path';
import { FormControl } from '@angular/forms';
import { PathService } from '../../Services/path.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-paths',
  templateUrl: './paths.component.html',
  styleUrls: ['./paths.component.css']
})
export class PathsComponent {
  Paths: Path[] = [];
  filteredpaths: Path[] = [];
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
  constructor(private _pathservice: PathService, 
    private dialog: MatDialog,
    private snackBar:MatSnackBar,
    private  router:Router) {
      this.pageSize = this.pageSizeOptions[0]
  }
  ngOnInit(): void {
    this.fetchpaths(this.currentPage,this.pageSize);
      
  }
  fetchpaths(page: number, pageSize: number) {
      this._pathservice.getpaths(page, pageSize).subscribe(
        (paths: any) => {
          this.Paths = paths.content.map((path: any) => {
            if (path.line === null) {
              path.line = { nameFr: 'Null' , nameAr:'Null' };
            }
            return path;
          });
          this.totalElements = paths.totalElements;
          this.totalPages = paths.totalPages;
        },
        (error) => {
          console.log('Error getting paths:', error);
        }
      );
    
  }
  openAddPathDialog() {
   this.router.navigate(['addpath'])
  }
  openEditpathDialog(path: Path) { 
    const navigationExtras: NavigationExtras = {
      state: {
        pathData: path // 'line' is the data you want to send to the update page
      }
    };
    this.router.navigate(['updatepath'],navigationExtras);
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
  deletepath(id: string) {
    const message = "Effacer la ligne?";
    const title = "Delete Line"
    const deletedialog = this.dialog.open(ConfirmationComponent, {
      data: { message: message, title: title },
    });
    deletedialog.afterClosed().subscribe((res) => {
      if (res == 'confirm')
        this._pathservice.deletepath(id).subscribe(()=>{
            this.openDelToast("Ligne a ete supprimé avec success");
            this.Paths = this.Paths.filter(line => line.id !== id);
            if (this.Paths.length === 0) {
              this.currentPage = this.currentPage -1
              if (this.currentPage < 0) {
                this.currentPage = 0;
              }
              this.fetchpaths(this.currentPage, this.pageSize);
            }
        },()=>{
          this.openfailToast("Erreur l\'ors de supprission");
        }
        )

    })
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchpaths(this.currentPage - 1, this.pageSize);
    console.log(this.currentPage)
  }

  onPageSizeChange(value :number):void{
    this.pageSize = value;
    this.fetchpaths(this.currentPage,this.pageSize);
  }
}
