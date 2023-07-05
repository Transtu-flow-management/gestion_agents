import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Condition } from '../../interfaces/condition';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { ConditionService } from '../../Services/condition.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateconditionComponent } from 'src/app/Dialogs/updatecondition/updatecondition.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddConditionComponent } from 'src/app/Dialogs/add-condition/add-condition.component';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.css']
})  //attacher la condition et autres parametres dans le page parametres
export class ConditionsComponent implements OnInit,AfterViewInit{

  conditions:Condition[] =[];
  displayedColumns: string[] = [ 'name', 'tracking', 'visibility','dateOfInsertion','dateOfModification','actions'];
  dataSource: MatTableDataSource<Condition>;
  currentPage =0;
  pageSize = 5;
  totalPages:number;
totalElements :number;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _conditonService:ConditionService,
    private dialog :MatDialog,
    private snackBar :MatSnackBar){
    
  }
  ngOnInit(): void {
    this.getConditions(this.currentPage,this.pageSize);
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getConditions(page:number,size:number){
    this._conditonService.getAllConditions(page,size).subscribe((conditions:any)=>{
      this.conditions =conditions.content;
      this.totalElements = conditions.totalElements;
      this.totalPages = conditions.totalPages;
       this.dataSource = new MatTableDataSource(this.conditions);
     
     });
     
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  
  }

  openEditdialog(row:any){
    this.dialog.open(UpdateconditionComponent,{
      width: '50%',
      data:{condition:row},
    })
  }


  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getConditions(this.currentPage,this.pageSize);
    console.log(this.currentPage);
  }

  delete(id:string):void{
    const deldialog = this.dialog.open(ConfirmationComponent,{
      data:{message:'delete condition'},
    });
    deldialog.afterClosed().subscribe((res) =>{
      const message = 'la condition a été supprimé avec succes';
  if (res =='confirm')
  this._conditonService.deleteCondition(id).subscribe({
    error : (res)=> {
      if(res.status ===410){
      this.snackBar.openFromComponent(SuccessToastComponent, {
        data: {message: message },
        duration:5000,
          horizontalPosition:"end",
          verticalPosition:"top",
          panelClass: ['snack-green','snack-size','snack-position']
      });}
    },
  })
  });
  }
  openAddConditionDialog():void{
    const dialogref = this.dialog.open(AddConditionComponent,{
      height:'60%',
      width:'70%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'200ms',
    });
  }
 
}
