import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reclammation } from '../../Models/Reclammation';
import { MatDialog } from '@angular/material/dialog';
import { ReportComponent } from 'src/app/Dialogs/report/report.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReclamService } from '../../Services/reclam.service';
import { CarService } from '../../Services/car.service';
import { Car } from '../../Models/Car';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reclammation',
  templateUrl: './reclammation.component.html',
  styleUrls: ['./reclammation.component.css']
})
export class ReclammationComponent implements OnInit{ 
  
  reclam : Reclammation[] = [];
  Cars:Car[]= [];
  ischecked : boolean = false;
  isFormSubmitted : boolean = false;
  errormessage : string;
  showerror : boolean = false;
  success : boolean = false;
  incident= [
    {title :'exemple incident 1',value:1},
    {title:'exemple incident 2',value:2},
    {title :'exemple incident 3',value:3},
    {title:'exemple incident 4',value:4},
    {title :'exemple incident 5',value:5},
    {title:'exemple incident 6',value:6},
  ]
  sujet= [
    {title :'sujet prédifinit 1',value:1},
    {title:'sujet prédifinit 2',value:2},
    {title :'sujet prédifinit 3',value:3},
    {title:'sujet prédifinit 4',value:4},
    {title :'sujet prédifinit 5',value:5},
    {title:'sujet prédifinit 6',value:6},
  ]

  addForm:FormGroup;
  checked : boolean = false;


constructor(private router:Router,private dialog:MatDialog,private fb:FormBuilder,private snackBar:MatSnackBar,
  private recS:ReclamService,private cs:CarService){

  this.addForm = this.fb.group({
    car : new FormControl('',Validators.required),
    type:new FormControl(null,Validators.required),
    predifinedContext: new FormControl('',Validators.required),
    timeOfIncident: new FormControl('',Validators.required),
  })


}

  ngOnInit(): void {
    this.cs.findcars().subscribe((cars)=>{
this.Cars = cars;
    })
  }
  openArchive() {
    this.router.navigate(['archive'])
   }

   addreclammation(){
this.isFormSubmitted = true;
    const formvalue = this.addForm.value;
    const datetimeControl = this.addForm.get('timeOfIncident');
    const formattedDatetime = new Date(datetimeControl.value).toLocaleString();
    formvalue.TimeOfIncident = formattedDatetime;
    if (this.addForm.valid){
      console.log(formvalue);
        this.recS.createReclam(formvalue).subscribe(()=>{
          this.success = true;
        },(error)=>{
          this.openfailToast("failed to add reclammation")
        })
    }
   }

   openfailToast(message: string): void {
    this.snackBar.openFromComponent(FailedToastComponent, {
      data: { message: message }, duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "bottom",
      panelClass: ['snack-red', 'snack-size']
    });
  }
   checkboxChanged(event: any): void {
    if (event && event.target && event.target.checked) {
      this.ischecked = true;
      if (this.addForm.valid) {
        this.showerror = false;
        this.opendialog(this.addForm.value);
      } else {
        this.showerror= true;
       this.errormessage = 'Form is not valid. Cannot open the dialog.';
      }
    }
  }

   opendialog(data:any){
    const dialogref= this.dialog.open(ReportComponent,{
      width:'60%',
      data:{
        formData:data
      }

    });
    dialogref.afterClosed().subscribe((result) => {
      console.log('Dialog closed:', result);
    });
  
   }

}
