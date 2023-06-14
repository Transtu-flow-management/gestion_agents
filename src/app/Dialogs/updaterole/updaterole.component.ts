import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap, of } from 'rxjs';
import { PermissionService } from 'src/app/Core/Services/permission.service';
import { RoleService } from 'src/app/Core/Services/role.service';
import { IPermissions } from 'src/app/Core/interfaces/Role';

@Component({
  selector: 'app-updaterole',
  templateUrl: './updaterole.component.html',
  styleUrls: ['./updaterole.component.css']
})
export class UpdateroleComponent {
  public selectedPerm: String[] = [];
  id: Number = null;
  roleName: String = '';
  permissions = Set<String>;
  isDialogOpen: boolean;

  assignedPermissions: String[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UpdateroleComponent>, private _roleService:RoleService,private _permissionservice:PermissionService) {
    const role: any = data.role;
    this.id = role.id;
    this.roleName = role.roleName;
    this.selectedPerm = role.selected;
    this.isDialogOpen = true;
  
  }
 
  selectedPermission(selectedbox: String[]): void {
    this.selectedPerm = selectedbox.map(p => p.toString());
  }
  Annuler(): void {
    this.dialogRef.close();
  }
  updateRole():void{
    const role =this.data.role
    role.roleName = this.roleName
    
    console.log("new: ",role)
    this._roleService.updateRole(this.data.role.id, role).pipe(
      switchMap(() => {
        if (!this.selectedPerm ||this.selectedPerm.length > 0) {
          
          //console.log("param: "+this.selectedPerm.length );
          return this._roleService.AssignPermssionsToRole(this.data.role.id, this.selectedPerm);
          
        } else {
          console.log("test2");
          return of(null);
        }
      })
      
    ).subscribe(
      (res) => {
        console.log('Role is updated', res);
        this.dialogRef.close();
      },
      (error) => {
        console.error('Failed to update role', error);
      }
    );
   }
  
  testAssign():void{
    const role =this.data.role
this._roleService.AssignPermssionsToRole(this.data.role.id,this.selectedPerm).subscribe(
 
  (res) => {
    console.log("selected permissions to roles: "+this.selectedPerm)
    console.log('Permissions assigned to role:', res);
  },
  (error) => {
    console.log("selected permissions to roles: "+this.selectedPerm)
    console.error('Failed to assign permissions to role:', error);
  }
);
  }
}
