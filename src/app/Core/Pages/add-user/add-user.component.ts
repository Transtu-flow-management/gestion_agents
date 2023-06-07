import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from '../../Services/user-service.service';
import { AuthService } from '../../Services/auth.service';
import { Agent } from '../../interfaces/Agent';
import { Role } from '../../interfaces/Role';
import { RoleService } from '../../Services/role.service';
import { registerDTO } from '../../../DTO/registerDTO';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit{

  agent: Agent ;
  addForm: FormGroup;
  selectedRole: string = '';
  isDropdownOpen: boolean = false;

  constructor(private fb:FormBuilder, private _service: AuthService,private _roleservice :RoleService, private _usrservice : UserServiceService){
    this.addForm = this.fb.group({
      name: [''],
      prenom: [''],
      email: [''],
      username:[''],
      password: ['']
    });
    }

    ngOnInit(): void {
      
    }


  

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectRole(role: any): void {
    this.selectedRole = role.id;
    this.isDropdownOpen = false;
    console.log('Selected Role:', this.selectedRole);
    // Perform any desired actions based on the selected role
  }

  addUser(): void {
    if (this.addForm.invalid) {
      return console.log("form invalide");
    }
    const formValue = this.addForm.value;
    this._service.register(formValue).subscribe((res)=>{
      alert('agent ajouté');
      console.log(res);
    },
    (error) => {
      console.log('Error occurred while adding agent:', error);})
   
  }
  
}
