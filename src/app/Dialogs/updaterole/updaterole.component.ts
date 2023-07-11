import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, of } from 'rxjs';
import { PermissionService } from 'src/app/Core/Services/permission.service';
import { RoleService } from 'src/app/Core/Services/role.service';
import { IPermissions, Role } from 'src/app/Core/interfaces/Role';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { UpdateToastComponent } from 'src/app/alerts/update-toast/update-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';

@Component({
  selector: 'app-updaterole',
  templateUrl: './updaterole.component.html',
  styleUrls: ['./updaterole.component.css']
})
export class UpdateroleComponent  implements OnInit{
  selectedPerm: string[] = [];
  id: number = null;
  roleName: string = '';
  isDialogOpen: boolean;
  containsPermissions: boolean = false;
  isModalSubmitted = false;
  assignedPermissions: string[] = [];
  updateForm: FormGroup
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateroleComponent>,
    private _roleService: RoleService,
    private _permissionservice: PermissionService, private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    const role: any = data.role;
    this.updateForm = this.fb.group({
      roleName: new FormControl(role.roleName, [Validators.required, Validators.minLength(3)])
    })
    this.selectedPerm = role.permissions;

  }
  ngOnInit(): void {
      console.log(this.data.role.permissions);
  }

  selectedPermission(selectedbox: string[]): void {
    this.selectedPerm = selectedbox;
  }

  close(): void {
    this.dialogRef.close();
  }
  dismissdialog() {
    this.isDialogOpen = false;
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
  ischanged(){
    const form = this.updateForm.getRawValue()
    const original = this.data.role;
    return form.roleName ===original.roleName 
  }

  updateRole(): void {
    this.isModalSubmitted = true;
    const role = this.updateForm.value;
    if (this.updateForm.invalid) {
      this.openWarningToast("Vérifiez que tous les champs sont remplis");
      return;
    }

    this._roleService.updateRole(this.data.role.id, role).pipe(
      switchMap(() => {
        if (this.selectedPerm && this.selectedPerm.length > 0) {
          this.containsPermissions = true;
          console.log(this.selectedPerm)
          return this._roleService.AssignPermssionsToRole(this.data.role.id, this.selectedPerm);
        }  else {
          return of(null);
        }
      })
    ).subscribe(
      (res) => {
        this.openAddToast("Rôle modifié avec succès");
        this.dialogRef.close();
      },
      (error) => {
        const errorMessage = `Erreur lors de la modification du rôle : ${error.status}`;
        this.openfailToast(errorMessage);
      }
    );
  }
 

  


}
