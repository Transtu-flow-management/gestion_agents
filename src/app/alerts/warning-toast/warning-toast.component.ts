import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-warning-toast',
  templateUrl: './warning-toast.component.html',
  styleUrls: ['./warning-toast.component.css']
})
export class WarningToastComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA)public data:any){}
}
