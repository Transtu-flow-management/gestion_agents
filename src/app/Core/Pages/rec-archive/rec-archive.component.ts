import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Reclammation } from '../../Models/Reclammation';
import { ReclamService } from '../../Services/reclam.service';
import { ShowreportComponent } from 'src/app/Dialogs/showreport/showreport.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-rec-archive',
  templateUrl: './rec-archive.component.html',
  styleUrls: ['./rec-archive.component.css']
})
export class RecArchiveComponent {

  currentPage = 0;
  pageSize = 5;
  totalAgents: number;
  totalPages: number;
  totalElements: number;
  reclams : Reclammation[] = [];
  pageSizeOptions: number[] = [5, 10, 20,50];

  incident= [
    {title :'exemple incident 1',value:1},
    {title:'exemple incident 2',value:2},
    {title :'exemple incident 3',value:3},
    {title:'exemple incident 4',value:4},
    {title :'exemple incident 5',value:5},
    {title:'exemple incident 6',value:6},
  ]

  constructor(private router :Router,private reclamservice : ReclamService,private dialog:MatDialog){
    this.loadagentspages(this.currentPage,this.pageSize);
  }

  openRec() {
    this.router.navigate(['reclammation'])
   }
   openContextModal(context: string,mail:string): void {
    this.dialog.open(ShowreportComponent, {
      width: '400px',
      data: { context,mail },
    });
  }

 

   public loadagentspages(page: number, pagesize: number): void {
  
   
      this.reclamservice.getReclams(page, pagesize).subscribe((res: any) => {
        this.reclams = res.content;
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
      }, (error) => {
        console.log("error getting agent pages", error);
      });
    
  }
  

   onPageSizeChange(value :number):void{
    this.pageSize = value;
    this.loadagentspages(this.currentPage,this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadagentspages(this.currentPage -1 , this.pageSize);
  }
}
