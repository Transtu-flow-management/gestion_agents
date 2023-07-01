import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConductorService } from 'src/app/Core/Services/conductor.service';
import { Conductor } from 'src/app/Core/interfaces/Conductor';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';

@Component({
  selector: 'app-add-conductor',
  templateUrl: './add-conductor.component.html',
  styleUrls: ['./add-conductor.component.css']
})
export class AddConductorComponent {

  Conductors: Conductor[] = [];
  addForm: FormGroup;
  isFormSubmitted = false;
  showdialg: boolean = true;
  constructor(private dialog: MatDialog,
    private _conductorservice: ConductorService,
    private fb: FormBuilder, private snackBar: MatSnackBar) {

    this.addForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(6)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(6)]),
      uid: new FormControl('', [Validators.required, Validators.minLength(4)]),
    })

  }
  add() {
    this.isFormSubmitted = true;
    const formValue = this.addForm.value;
    if (this.addForm.valid) {
      this._conductorservice.addconductor(formValue).subscribe(() => {
        this.openAddToast('Conducteur ajoué avec success');
       this.close();
      })
    }else
    this.openWarningToast("Verifier tous les chanps");
  }
  close() {
    this.dialog.closeAll()
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
  openWarningToast(message: string): void {
    this.snackBar.openFromComponent(WarningToastComponent, {
      data: { message: message },
      duration: 5000,
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: ['snack-yellow', 'snack-size']
    });
  }
  dismissdialog() {
    this.showdialg = false;
  }
}
