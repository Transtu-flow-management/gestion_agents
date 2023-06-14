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
  Roles :Role[] = [];
currentPage =0;
pageSize = 2;
totalAgents :number;
totalPages:number;
totalElements :number;

  constructor(private _roleservice : RoleService , private _dialog :MatDialog){}

ngOnInit(): void {
  this.getRoles(this.currentPage,this.pageSize);    
}
getRoles(page:number,size:number):void{
  this._roleservice.getRolesPage(page,size).subscribe(
    (Roles:any) => {
      this.Roles =Roles.content;
      this.totalElements=Roles.totalElements;
      this.totalPages =Roles.totalPages;
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
     //this.getRoles();
   },
   error: console.log
 })
 }
 onPageChange(page :number){
  this.currentPage = page ;
  this.getRoles(this.currentPage-1,this.pageSize);
  console.log(this.currentPage)
}
}
