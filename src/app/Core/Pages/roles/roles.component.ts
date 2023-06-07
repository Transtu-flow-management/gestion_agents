import { Component, OnInit } from '@angular/core';
import { Role } from '../../interfaces/Role';
import { RoleService } from '../../Services/role.service';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { RoleModalComponent } from '../../../Dialogs/role-modal/role-modal.component';
import { UpdateroleComponent } from '../../../Dialogs/updaterole/updaterole.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit{
  isModalOpen = false;
  Roles :Role[] = []
  constructor(private _roleservice : RoleService , private _dialog :MatDialog){}

ngOnInit(): void {
  this.getRoles()    
}
getRoles():void{
  this._roleservice.getRoles().subscribe(
    Roles => {
      this.Roles =Roles
    },
    error =>{
      console.log("error getting roles from DB")
    }
  )
}
openRoleDialog(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus=true;
  const dialogRef = this._dialog.open(RoleModalComponent,{
    width :'50%',height:'400px',
    enterAnimationDuration:'1000ms',
    exitAnimationDuration:'2000ms',
  });
  dialogRef.afterClosed().subscribe(result =>{
    if (result){
      console.log(result);
    }
  })
}
openEditRoleDialog(role:Role):void{
const dialogref = this._dialog.open(UpdateroleComponent,{
  width :'70%',height:'400px',
    enterAnimationDuration:'1000ms',
    exitAnimationDuration:'2000ms',
    data: { role: role, assignedPermissions:role.permissions}
})
}

deleteRole(id:Number):void{
  if (confirm('Confirm delete'))
 this._roleservice.deleteRole(id).subscribe({
   next : (res)=> {
     alert('Agent supprimé');
     this.getRoles();
   },
   error: console.log
 })
 }
}
