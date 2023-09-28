import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Condition } from 'src/app/Core/Models/condition';
import { ConditionService } from 'src/app/Core/Services/condition.service';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';

@Component({
  selector: 'app-add-condition',
  templateUrl: './add-condition.component.html',
  styleUrls: ['./add-condition.component.css']
})
export class AddConditionComponent {
  addForm: FormGroup;
  isFormSubmitted = false;
  showdialg: boolean = true;
  conditions: Condition[] = [];

  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,private cs:ConditionService) {

    this.addForm = this.fb.group({

      name: new FormControl('', [Validators.required]),
      tracking: new FormControl(null, [Validators.required]),
      visibility: new FormControl(null, [Validators.required]),
    });
  }

  close() {
    this.dialog.closeAll()
  }

  dismissdialog() {
    this.showdialg = false;
  }
  openAddToast(message: string) {
    this.snackBar.openFromComponent(SuccessToastComponent, {
      data: { message: message },
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: ['snack-green', 'snack-size', 'snack-position']
    })
  }
  openfailToast(message: string): void {
    this.snackBar.openFromComponent(FailedToastComponent, {
      data: { message: message }, duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "bottom",
      panelClass: ['snack-red', 'snack-size']
    });
  }
  add() { 
const formvalue = this.addForm.value;
  this.cs.createCondition(formvalue).subscribe(()=>{
    this.openAddToast("Condition Ajouté avec succeés");
    this.close();
  },()=>{
    this.openfailToast("Erreur ajout de condition");
  })
  }

}
