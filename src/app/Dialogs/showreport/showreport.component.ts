import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-showreport',
  templateUrl: './showreport.component.html',
  styleUrls: ['./showreport.component.css']
})
export class ShowreportComponent {
  constructor(
    public dialogRef: MatDialogRef<ShowreportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  get context(): string {
    return this.data.context;
  }
  get mail():string{
    return this.data.mail
  }

  onClose(): void {
    this.dialogRef.close();
  }
}