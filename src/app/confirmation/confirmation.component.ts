import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {

  open = true;
constructor(public dialogref : MatDialogRef<ConfirmationComponent>, @Inject(MAT_DIALOG_DATA)public data:any){}

  confirm(): void {
    this.dialogref.close('confirm')
  }

  cancel(): void {
    this.dialogref.close('cancel');
  }
}
