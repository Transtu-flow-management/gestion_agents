import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReclamService } from 'src/app/Core/Services/reclam.service';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {

  modalform : FormGroup;
constructor(private fb:FormBuilder,private RecS :ReclamService,
  private snackBar:MatSnackBar, private dialog:MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any){
 const formData:any = this.data.formData;
  this.modalform = this.fb.group({
    context:new FormControl('',Validators.required),
    email:new FormControl('',[Validators.required, Validators.email]),
    car : new FormControl(formData.car),
    type:new FormControl(formData.type),
    predifinedContext: new FormControl(formData.predifinedContext),
    timeOfIncident: new FormControl(formData.timeOfIncident),
  })

}

close(){
  this.dialog.closeAll();
}
openAddToast(message:string){
  this.snackBar.openFromComponent(SuccessToastComponent,{
    data :{message:message},
    duration:5000,
    horizontalPosition:"end",
    verticalPosition:"top",
    panelClass: ['snack-green','snack-size','snack-position']
  })
 }
 openfailToast(message:string):void{
  this.snackBar.openFromComponent(FailedToastComponent,{
    data: {message:message},duration: 5000,
    horizontalPosition: "end",
       verticalPosition:"bottom",
       panelClass : ['snack-red','snack-size']
  });
   }

submitform():void{
  const formvalue = this.modalform.value;
  
  console.log(formvalue);
  if (this.modalform.valid){
   this.RecS.createReclam(formvalue).subscribe(()=>{
    this.RecS.sendmail(formvalue).subscribe(()=>{
      this.openAddToast("Rapport envoyé au destinatiare");
      this.close()
    })
   },(err)=>{
    this.openfailToast("Erreur l\'ors de l\'envoi");
   })
  }
}



}
