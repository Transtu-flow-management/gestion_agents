import { Component, OnInit,Inject } from '@angular/core';

import { IPermissions, Role } from '../../interfaces/Role';

import { PermissionService } from '../../Services/permission.service';
import { RoleService } from '../../Services/role.service';
import { UserServiceService } from '../../Services/user-service.service';
import { AssignRoledialogComponent } from 'src/app/Dialogs/assign-roledialog/assign-roledialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{

  role :Role[]=[]
  selected :String;
   constructor(private _roleService : RoleService, private _Agentservice : UserServiceService){
    
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
 

}
