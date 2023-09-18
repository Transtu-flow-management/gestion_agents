import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReclamService } from 'src/app/Core/Services/reclam.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {

  modalform : FormGroup;
constructor(private fb:FormBuilder,private RecS :ReclamService,@Inject(MAT_DIALOG_DATA) public data: any){
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

submitform():void{
  const formvalue = this.modalform.value;
  
  console.log(formvalue);
  if (this.modalform.valid){
   this.RecS.createReclam(formvalue).subscribe(()=>{
    console.log("validé");
   })
  }
}



}
