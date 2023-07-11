import { Component, Inject, ViewEncapsulation  } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from '../../Core/Services/user-service.service';
import { AuthService } from '../../Core/Services/auth.service';
import { Agent } from '../../Core/interfaces/Agent';
import { Role } from '../../Core/interfaces/Role';
import { RoleService } from '../../Core/Services/role.service';
import { registerDTO } from '../../DTO/registerDTO';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { passwordMatchValidator, passwordValidator } from 'src/app/Validators/passwordmatch';
import { format } from 'date-fns';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AddUserComponent{
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  agent: Agent ;
  addForm: FormGroup;
  selectedRole: string = '';
  isDropdownOpen: boolean = false;
  fileupload :Array<File> =[];
  isFormSubmitted:boolean= false;
  showdialg= true;
  selectedfile:string ='';



  constructor(private fb:FormBuilder, private _service: AuthService,
    private snackbar :MatSnackBar,
    private dialog:MatDialogRef<AddUserComponent>,
    private snackBar :MatSnackBar){


    this.addForm = this.fb.group({
      name:new FormControl ('',[Validators.required, Validators.minLength(3)]),
      surname:new FormControl ('',[Validators.required, Validators.minLength(3)]),
      username: [''],

      password: new FormControl ('',[Validators.required, Validators.minLength(8)]),
      con_password: new FormControl ('',[Validators.required, Validators.minLength(8)]),
      address:new FormControl ('',[Validators.required, Validators.minLength(12)]),
      phone:new FormControl ('',[Validators.required, Validators.minLength(8)]),
      dateOfBirth: new FormControl(null, [Validators.required])


    },{ validators: passwordMatchValidator });
    this.addForm.controls['username'].setValidators([
      Validators.required,
      Validators.email,
    ]);
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

}


