import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Condition } from 'src/app/Core/interfaces/condition';

@Component({
  selector: 'app-add-condition',
  templateUrl: './add-condition.component.html',
  styleUrls: ['./add-condition.component.css']
})
export class AddConditionComponent {
  updateForm: FormGroup;
  isFormSubmitted = false;
  showdialg: boolean = true;
  conditions: Condition[] = [];

  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) {

    this.updateForm = this.fb.group({

      name: new FormControl('', [Validators.required, Validators.minLength(6)]),
      tracking: new FormControl(null, [Validators.required, Validators.maxLength(1)]),
      visibility: new FormControl(null, [Validators.required, Validators.maxLength(1)]),
    });
  }

  close() {
    this.dialog.closeAll()
  }

  dismissdialog() {
    this.showdialg = false;
  }

  add() { }

}
