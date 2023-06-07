import { Component ,OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit{
  showToast: boolean = true;
  showSuccessToast: boolean = true;
  currentTime: Date;
  constructor(
    public dialogRef: MatDialogRef<ErrorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {this.currentTime = this.getCurrentTime();}

  ngOnInit(): void {
    this.dismissToast();
  }
  close()
 {
    this.dialogRef.close();
  }
  dismissToast():void{
    this.showToast = false;    
    this.showSuccessToast = false;
  }
  getCurrentTime():Date{
    return new Date();
  }
}
