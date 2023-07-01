import { Component,EventEmitter,Inject, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConductorService } from 'src/app/Core/Services/conductor.service';
import { Conductor } from 'src/app/Core/interfaces/Conductor';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { UpdateToastComponent } from 'src/app/alerts/update-toast/update-toast.component';

@Component({
  selector: 'app-update-conductor',
  templateUrl: './update-conductor.component.html',
  styleUrls: ['./update-conductor.component.css']
})
export class UpdateConductorComponent {
  Conductors: Conductor[] = [];
  updateForm: FormGroup;
  isFormSubmitted = false;
  showdialg: boolean = true;
  @Output() conductorUpdated: EventEmitter<Conductor> = new EventEmitter<Conductor>();
  constructor(private dialog: MatDialog,
    private _conductorservice: ConductorService,
    private fb: FormBuilder, private snackBar: MatSnackBar, 
    private dialogRef: MatDialogRef<UpdateConductorComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any) {
      const conductor :any = data.conductor

    this.updateForm = this.fb.group({
      name: new FormControl(conductor.name, [Validators.required, Validators.minLength(6)]),
      surname: new FormControl(conductor.surname, [Validators.required, Validators.minLength(6)]),
      uid: new FormControl(conductor.uid, [Validators.required, Validators.minLength(4)]),
    });

  }

  dismissdialog() {
    this.showdialg = false;
  }
  close() {
    this.dialog.closeAll()
  }

  isFormUnchanged(){
    var condct = this.updateForm.getRawValue();
    const checkvalues = this.data.conductor;
    return condct.name === checkvalues.name && condct.surname === checkvalues.surname && condct.uid === checkvalues.uid;
   }
   openToast(message: string): void {
    this.snackBar.openFromComponent(UpdateToastComponent,{
      data :{message:message},
      duration:3000,
      horizontalPosition:"end",
      verticalPosition:"top",
      panelClass: ['snack-green','snack-size','snack-position']
    })
 }
openErrorToast(message:string){
  this.snackBar.openFromComponent(FailedToastComponent,{
    data :{message:message},
    duration:3000,
    horizontalPosition: "end",
    verticalPosition: "bottom",
    panelClass : ['snack-red','snack-size']
});
}

   public update():void{
    this.isFormSubmitted = true;
    var condcutor = this.updateForm.getRawValue();
if (!this.isFormUnchanged()){
  this._conductorservice.updateconductor(this.data.conductor.id,condcutor).subscribe(()=>{
    this.openToast('Le conduteur a été mis à jour');
    this.dialogRef.close();
  },()=>{
    this.openErrorToast("erreur updating condicteur");
  });

}
   }

}
