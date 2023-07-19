import { Component ,Inject} from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.css']
})
export class WarningComponent {
  constructor (@Inject(MAT_SNACK_BAR_DATA)public data:any){}
}
