import { Component, OnInit } from '@angular/core';
import { Role } from '../../Models/Role';
import { RoleService } from '../../Services/role.service';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { RoleModalComponent } from '../../../Dialogs/role-modal/role-modal.component';
import { UpdateroleComponent } from '../../../Dialogs/updaterole/updaterole.component';
import { ErrorsComponent } from 'src/app/Dialogs/errors/errors.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit{
  isModalOpen = false;
  Roles :Role[] = [];
currentPage =0;
pageSize = 4;
totalAgents :number;
totalPages:number;
totalElements :number;
pageSizeOptions: number[] = [5, 10, 20];


  constructor(private _roleservice : RoleService , private _dialog :MatDialog,private snackbar:MatSnackBar){
this.pageSize = this.pageSizeOptions[0]
  }

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
      this.openError('Erreur l\'ors de l\'affichage de liste des Roles','backend Error')
      console.log(error)
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
    this.currentPage =0;
    this.getRoles(this.currentPage,this.pageSize);
  })
}
openEditRoleDialog(role:Role):void{
const dialogref = this._dialog.open(UpdateroleComponent,{
  width :'70%',height:'auto',
    enterAnimationDuration:'1000ms',
    exitAnimationDuration:'1000ms',
    data: { role: role, assignedPermissions:role.permissions}
})
dialogref.afterClosed().subscribe(()=>{
  this.currentPage =0;
  this.getRoles(this.currentPage,this.pageSize);
})
}

openError(message:string,title:string){
  const dialogrf = this._dialog.open(ErrorsComponent,{
    data :{message:message,title:title}
  }) 
}

deleteRole(id:Number):void{
  const deleteDialog = this._dialog.open(ConfirmationComponent, {
    data: { message: 'Êtes-vous sûr de vouloir supprimer ce Role ?' ,title:"Delete"},
  });

  deleteDialog.afterClosed().subscribe((res) => {
    if (res === 'confirm') {
      this._roleservice.deleteRole(id).subscribe({
        next: () => {
         this.openDelToast("Le Role a été supprimé avec succès");
         this.Roles = this.Roles.filter(line => line.id !== id);
         if (this.Roles.length === 0) {
          this.currentPage = this.currentPage -1
          if (this.currentPage < 0) {
            this.currentPage = 0;
          }
          this.getRoles(this.currentPage, this.pageSize);
        }
        },
        error: (error) => {
          if (error.status === 409) {
            const warningDialog = this._dialog.open(WarningToastComponent, {
              data: { message: 'Ce Role est associé à Un Agent. Voulez-vous quand même le supprimer ?',title:"Warning" },
            });

            warningDialog.afterClosed().subscribe((res) => {
              if (res === 'confirm') {
                this._roleservice.deleteRole(id,true).subscribe({
                  next: () => {
                    this.openDelToast("Le Role a été supprimé avec succès");
                    this.Roles = this.Roles.filter(line => line.id !== id);
                    if (this.Roles.length === 0) {
                      this.currentPage = this.currentPage -1
                      if (this.currentPage < 0) {
                        this.currentPage = 0;
                      }
                      this.getRoles(this.currentPage, this.pageSize);
                    }
                  },
                  error: (error) => {
                    const errorMessage = `Failed to delete Role : ${error.status}`;
                    this.openfailToast(errorMessage)
                  }
                });
              }
            });
          } else {
            const errorMessage = `Failed to delete Role : ${error.status}`;
            this.openfailToast(errorMessage)
          }
        }
      });
    }
  });
}

openDelToast(message: string) {
  this.snackbar.openFromComponent(SuccessToastComponent, {
    data: { message: message },
    duration: 5000,
    horizontalPosition: "end",
    verticalPosition: "top",
    panelClass: ['snack-green', 'snack-size', 'snack-position']
  })
}
openfailToast(message: string): void {
  this.snackbar.openFromComponent(FailedToastComponent, {
    data: { message: message }, duration: 5000,
    horizontalPosition: "end",
    verticalPosition: "bottom",
    panelClass: ['snack-red', 'snack-size']
  });
}

 onPageChange(page :number){
  this.currentPage = page ;
  this.getRoles(this.currentPage-1,this.pageSize);

  console.log(this.currentPage)
}
onPageSizeChange(value :number):void{
  this.pageSize = value;
  this.getRoles(this.currentPage,this.pageSize);
}
}
