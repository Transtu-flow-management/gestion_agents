import { Component,Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from 'src/app/Core/Services/role.service';
import { UserServiceService } from 'src/app/Core/Services/user-service.service';
import { Role } from 'src/app/Core/interfaces/Role';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { UpdateToastComponent } from 'src/app/alerts/update-toast/update-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';
@Component({
  selector: 'app-assign-roledialog',
  templateUrl: './assign-roledialog.component.html',
  styleUrls: ['./assign-roledialog.component.css']
})
export class AssignRoledialogComponent implements OnInit {
  roles :Role[]=[]
  selected :String;
   constructor(private _roleService : RoleService, private _Agentservice : UserServiceService,
     @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssignRoledialogComponent>,
    private snackBar:MatSnackBar){
  }
  ngOnInit(): void {
      this.fetchRoles()
  }
  fetchRoles(){
    this._roleService.getRoles().subscribe((role : Role[])=>
    {
      this.roles=role
    },(error)=>{
      console.error('failed to fetch Roles from DB',error)
    }
    )
  }
  onRoleSelectionChange(){
    console.log("selected role :"+this.getRoleId(this.selected));
  }

  openAddToast(message: string) {
    this.snackBar.openFromComponent(UpdateToastComponent, {
      data: { message: message },
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: ['snack-green', 'snack-size', 'snack-position']
    })
  }
  openWarningToast(message: string): void {
    this.snackBar.openFromComponent(WarningToastComponent, {
      data: { message: message }, duration: 5000,
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: ['snack-yellow', 'snack-size']
    });
  }


  openfailToast(message: string): void {
    this.snackBar.openFromComponent(FailedToastComponent, {
      data: { message: message }, duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "bottom",
      panelClass: ['snack-red', 'snack-size']
    });
  }

  AddRole(){

    this._Agentservice.assignRole(this.data.agent.id,this.getRoleId(this.selected)).subscribe((res)=>{
      this.openAddToast("Role Ajouté avec success");
      this.dialogRef.close()
    },
    (error)=>{
      const errorMessage = `Erreur, le role n'a pas été assigné : ${error.status}`;
        this.openfailToast(errorMessage);
    })
  }
  getRoleId(roleName: String): Number {
    const role = this.roles.find((r) => r.roleName === roleName);
    return role ? role.id :null; 
  }
}
