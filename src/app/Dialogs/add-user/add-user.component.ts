import { Component, Inject, ViewEncapsulation,OnInit  } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AuthService } from '../../Core/Services/auth.service';
import { Agent } from '../../Core/Models/Agent';

import { MatSnackBar, MatSnackBarConfig, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { passwordMatchValidator, passwordValidator } from 'src/app/Validators/passwordmatch';
import { format } from 'date-fns';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Depot } from 'src/app/Core/Models/depot';
import { EntropotService } from 'src/app/Core/Services/entropot.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter, :leave', [
        animate(800)
      ])
    ])
  ]

})

export class AddUserComponent implements OnInit{
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  agent: Agent ;
  warehouse:Depot [] = [];
  addForm: FormGroup;
  selectedRole: string = '';
  isDropdownOpen: boolean = false;
  fileupload :Array<File> =[];
  isFormSubmitted:boolean= false;
  showdialg= true;
  checked: boolean = false;
  selectedfile:string ='';



  constructor(private fb:FormBuilder, private _service: AuthService, private _warehouseService : EntropotService,
    private snackbar :MatSnackBar,
    private dialog:MatDialogRef<AddUserComponent>,
    private snackBar :MatSnackBar){


    this.addForm = this.fb.group({
      name:new FormControl ('',[Validators.required, Validators.minLength(3)]),
      surname:new FormControl ('',[Validators.required, Validators.minLength(3)]),
      username: [''],
      depot : new FormControl('',this.depotValidator()),
      password: new FormControl ('',[Validators.required, Validators.minLength(8)]),
      con_password: new FormControl ('',[Validators.required, Validators.minLength(8)]),
      address:new FormControl ('',[Validators.required, Validators.minLength(12)]),
      phone:new FormControl ('',[Validators.required, Validators.minLength(8)]),
      dateOfBirth: new FormControl(null), //not required
      checked: [false]

    },{ validators: passwordMatchValidator });
    this.addForm.controls['username'].setValidators([
      Validators.required,
      Validators.email,
      this.mailValidator()
    ]);
    }
  ngOnInit(): void {
   this.getallwarehouses();
  }
  private depotValidator():ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isChecked = control.value;
      const depot = control.value;
      if (isChecked && !depot) {
        return { requiredOption: true };
      }
      return null;
    };
  }
  private mailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email = control.value;
      if (email && !email.toLowerCase().endsWith('@transtu.tn')) {
        return { invalidEmail: true };
      }
      return null;
    };
  }
     passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
      const password = control.value;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (password && !passwordRegex.test(password)) {
        return { invalidPassword: true };
      }
      return null;
    }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onfileRead(event:any){
    const file: File = event.target.files[0];
  
  const reader = new FileReader();

  reader.onload = (e: any) => {
    this.selectedfile = e.target.result;
  };

  reader.readAsDataURL(file);
  }
  onFileChange(files :any){
    
    const file =files.target.files;
    this.fileupload=file;
    
  }
  
  addUser(): void {
    this.isFormSubmitted= true;
    const dateOfBirth = this.addForm.value.dateOfBirth;
const formattedDateOfBirth = format(dateOfBirth, 'yyyy-MM-dd');
    let formdata = new FormData();
    if (this.addForm.invalid) {
      this.openWarningToast("Vérifiez que tous les champs sont remplis");
      console.log( this.addForm.value.dateOfBirth)
      return;
    }

  
    formdata.append('name',this.addForm.value.name);
    formdata.append('surname',this.addForm.value.surname);
    formdata.append('username',this.addForm.value.username);
    formdata.append('password',this.addForm.value.password);
    formdata.append('address',this.addForm.value.address);
    formdata.append('phone',this.addForm.value.phone);
    formdata.append('file',this.fileupload[0]);
    formdata.append('dateOfBirth', formattedDateOfBirth);
    formdata.append('warehouse',this.addForm.value.depot);
    
    this._service.register(formdata).subscribe((valid)=>{
      this.openAddToast("Agent ajouté Avec Success");
      this.dialog.close(formdata);
    },
    (error) => {
      const errorMessage = `Erreur lors de l'ajout d'un agent : ${error.status}`;
      this.openfailToast(errorMessage);
      this.dismissdialog()
      ;})
  }
  openSnackBar(message: string,
    duration: number = 5000,
    appearance: 'fill' | 'outline' | 'soft' = 'fill',
    type: 'info' | 'success' | 'error' = 'info'): void {

const config: MatSnackBarConfig = {
duration: duration,
verticalPosition: 'top',
horizontalPosition: 'center',
panelClass: [`alert-type-${appearance}-${type}`]
};
this.snackbar.open(message, '', config);
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
 openWarningToast(message:string):void{
  this.snackBar.openFromComponent(WarningToastComponent,{
    data: {message:message},duration: 5000,
  horizontalPosition: "center",
     verticalPosition: "top",
     panelClass : ['snack-yellow','snack-size']
});
 }


 openfailToast(message:string):void{
this.snackBar.openFromComponent(FailedToastComponent,{
  data: {message:message},duration: 5000,
  horizontalPosition: "end",
     verticalPosition: this.verticalPosition,
     panelClass : ['snack-red','snack-size']
});
 }
close()
{
   this.dialog.close()
 }
dismissdialog(){
  this.showdialg = false;    
}
getallwarehouses():void{
this._warehouseService.getAllentrp().subscribe((wh)=>{
  this.warehouse = wh;
})

}

}


