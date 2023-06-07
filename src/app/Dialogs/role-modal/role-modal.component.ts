import { Component  } from '@angular/core';
import {  MatDialogRef } from '@angular/material/dialog';
import { RoleService } from 'src/app/Core/Services/role.service';
import { IPermissions, Role } from 'src/app/Core/interfaces/Role';
import {
  Input,
  initTE,
} from "tw-elements";

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.css']
})
export class RoleModalComponent {
  roleName : String = '';
  
  constructor(private dialogRef: MatDialogRef<RoleModalComponent>,private _roleservice: RoleService){
    
  }

Annuler():void{
  this.dialogRef.close();
}
addrole():void{
 if (this.roleName){
  var newRole : Role = {
    id: null,
    dateOfCreation :null,
    dateOfModification :null,
    roleName:this.roleName,
    permissions :null
  };
  this.dialogRef.close(newRole);
  
 };
}


}
