import { Component, Inject ,OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
@Component({
  selector: 'app-failed-toast',
  templateUrl: './failed-toast.component.html',
  styleUrls: ['./failed-toast.component.css']
})
export class FailedToastComponent {
  
  constructor( @Inject(MAT_SNACK_BAR_DATA) public data: any,
  ){
     
   }
}
