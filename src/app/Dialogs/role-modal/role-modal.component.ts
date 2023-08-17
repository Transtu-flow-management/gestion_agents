import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from 'src/app/Core/Services/role.service';
import { IPermissions, Role } from 'src/app/Core/Models/Role';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
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
  roleName: String = '';
  addForm: FormGroup;
  showdialg = false;
  isFormSubmitted = false;
  constructor(private dialogRef: MatDialogRef<RoleModalComponent>,
     private _roleservice: RoleService,private snackBar:MatSnackBar,
     private fb:FormBuilder) {
      this.addForm = this.fb.group({
        roleName: new FormControl('', [Validators.required, Validators.minLength(4)]),
      })
  }

  Annuler(): void {
    this.dialogRef.close();
  }
  openAddToast(message:string){
    this.snackBar.openFromComponent(SuccessToastComponent,{
      data :{message:message},
      duration:5000,
      horizontalPosition:"end",
      verticalPosition:"top",
      panelClass: ['snack-green','snack-size','snack-position']
    })
   }
 openfailToast(message: string): void {
  this.snackBar.openFromComponent(FailedToastComponent, {
   data: {message: message },
   duration: 3000,
   horizontalPosition: "end",
   verticalPosition: "bottom",
   panelClass: ['snack-red','snack-size']
 });
}

  addrole(): void {
    this.isFormSubmitted = true;
    const newRole = this.addForm.value;
    if (this.addForm.valid) {
      
      this._roleservice.createRole(newRole).subscribe((res) => {
        this. openAddToast("Role ajouté avec succes")
        this.dialogRef.close(newRole);
      },

        (error) => {
          this.openfailToast("failed to add Role");
        })

    }
  }
  close()
  {
     this.dialogRef.close()
   }
  dismissdialog(){
    this.showdialg = false;    
  }
}

