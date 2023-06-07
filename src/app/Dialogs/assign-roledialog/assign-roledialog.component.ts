import { Component,Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import { RoleService } from 'src/app/Core/Services/role.service';
import { UserServiceService } from 'src/app/Core/Services/user-service.service';
import { Role } from 'src/app/Core/interfaces/Role';
@Component({
  selector: 'app-assign-roledialog',
  templateUrl: './assign-roledialog.component.html',
  styleUrls: ['./assign-roledialog.component.css']
})
export class AssignRoledialogComponent implements OnInit {
  role :Role[]=[]
  selected :String;
  id: Number = null;
   constructor(private _roleService : RoleService, private _Agentservice : UserServiceService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AssignRoledialogComponent>){
    
  this.id = data.agent.id;
  }
  ngOnInit(): void {
      this.fetchRoles()
  }
  fetchRoles(){
    this._roleService.getRoles().subscribe((role : Role[])=>
    {
      this.role=role
    },(error)=>{
      console.error('failed to fetch Roles from DB',error)
    }
    )
  }
  onRoleSelectionChange(){
    console.log("selected role :"+this.getRoleId(this.selected));
  }
  AddRole(){

    this._Agentservice.assignRole(this.data.agent.id,this.getRoleId(this.selected)).subscribe((res)=>{
      console.log("Role assigne avec success",res);
    },
    (error)=>{
      console.log("Error Assigning Role to Agent",error);
    })
  }
  getRoleId(roleName: String): Number {
    const role = this.role.find((r) => r.roleName === roleName);
    return role ? role.id :null; 
  }
}
