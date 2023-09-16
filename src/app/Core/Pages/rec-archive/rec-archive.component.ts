import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Reclammation } from '../../Models/Reclammation';
import { ReclamService } from '../../Services/reclam.service';

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

  constructor(private router :Router,private reclamservice : ReclamService){}

  openRec() {
    this.router.navigate(['reclammation'])
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
