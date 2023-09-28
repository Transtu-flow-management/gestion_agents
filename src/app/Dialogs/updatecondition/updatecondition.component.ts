import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConditionService } from 'src/app/Core/Services/condition.service';
import { Condition } from 'src/app/Core/Models/condition';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { UpdateToastComponent } from 'src/app/alerts/update-toast/update-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';

@Component({
  selector: 'app-updatecondition',
  templateUrl: './updatecondition.component.html',
  styleUrls: ['./updatecondition.component.css']
})
export class UpdateconditionComponent {
  updateForm: FormGroup;
  isFormSubmitted = false;
  showdialg: boolean = true;
  conditions : Condition[] =[];

  constructor(private dialog:MatDialog,private _condtitionservice: ConditionService,
    private fb:FormBuilder,
    private snackBar:MatSnackBar,
    private dialogRef : MatDialogRef<UpdateconditionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
    const condition :any = data.condition
    this.updateForm = this.fb.group({
      
      name: new FormControl(condition.name, [Validators.required, Validators.minLength(2)]),
      tracking: new FormControl(condition.tracking, [Validators.required,Validators.max(9),Validators.min(0)]),
      visibility: new FormControl(condition.visibility, [Validators.required,Validators.max(9),Validators.min(0)]),
    })

  }
  close(){
this.dialog.closeAll()
  }

  isFormUnchanged(){
    var condit = this.updateForm.getRawValue();
    const checkvalues = this.data.condition;
    return condit.name === checkvalues.name && condit.tracking === checkvalues.tracking && condit.visibility === checkvalues.visibility;
   }

dismissdialog(){
  this.showdialg =false;
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

openWarningToast(message:string):void{
  this.snackBar.openFromComponent(WarningToastComponent,{
    data: {message:message},duration: 5000,
  horizontalPosition: "center",
     verticalPosition: "top",
     panelClass : ['snack-yellow','snack-size']
});
 }

update(){
  this.isFormSubmitted =true;
  var condition = this.updateForm.getRawValue();
  if (this.updateForm.invalid){
   this.openWarningToast("Form invalide")
  }else{
  if (!this.isFormUnchanged()){
    this._condtitionservice.updateCondition(this.data.condition.id,condition).subscribe(()=>{
      this.openToast('La condition a été mis à jour');
      this.close();
      this.dialogRef.close();
    },()=>{
      this.openErrorToast("erreur updating condition");
    });  
  }
}
}
}
