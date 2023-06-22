import { Component, Inject, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from '../../Services/user-service.service';
import { AuthService } from '../../Services/auth.service';
import { Agent } from '../../interfaces/Agent';
import { Role } from '../../interfaces/Role';
import { RoleService } from '../../Services/role.service';
import { registerDTO } from '../../../DTO/registerDTO';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AddUserComponent{

  agent: Agent ;
  addForm: FormGroup;
  selectedRole: string = '';
  isDropdownOpen: boolean = false;
  fileupload :Array<File> =[];

  constructor(private fb:FormBuilder, private _service: AuthService,private _roleservice :RoleService, private _usrservice : UserServiceService,
     private router : Router,private snackbar :MatSnackBar){
    this.addForm = this.fb.group({
      name: [''],
      prenom: [''],
      email: [''],
      username:[''],
      password: ['']
    });
    }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onFileChange(files :any){
    
    const file =files.target.files;
    this.fileupload=file;
    console.log(this.fileupload)
  }
  
  addUser(): void {
    let formdata = new FormData();
    formdata.append('name',this.addForm.value.name);
    formdata.append('prenom',this.addForm.value.prenom);
    formdata.append('email',this.addForm.value.email);
    formdata.append('username',this.addForm.value.username);
    formdata.append('password',this.addForm.value.password);
    formdata.append('file',this.fileupload[0]);
    if (this.addForm.invalid) {
      this.snackbar.open("forme invalide","error",{
        panelClass :'green-snackbar',
        duration :3000, 
      })
    }
    this._service.register(formdata).subscribe((res)=>{
      alert('agent ajouté');
      console.log(res);
    },
    (error) => {
      console.log('Error occurred while adding agent:', error);})
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
  
}
