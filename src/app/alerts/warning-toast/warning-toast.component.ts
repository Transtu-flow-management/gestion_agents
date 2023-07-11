import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-warning-toast',
  templateUrl: './warning-toast.component.html',
  styleUrls: ['./warning-toast.component.css']
})
export class WarningToastComponent {

  open = true;
constructor(public dialogref : MatDialogRef<WarningToastComponent>, @Inject(MAT_DIALOG_DATA)public data:any){}

  confirm(): void {
    this.dialogref.close('confirm')
  }

  cancel(): void {
    this.dialogref.close('cancel');
  }
}
