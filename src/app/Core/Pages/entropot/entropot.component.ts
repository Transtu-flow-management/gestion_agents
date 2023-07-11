import { Component,OnInit } from '@angular/core';
import { Depot } from '../../interfaces/depot';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EntropotService } from '../../Services/entropot.service';
import { AddDepoComponent } from 'src/app/Dialogs/add-depo/add-depo.component';
import { HttpClient } from '@angular/common/http';
import { UpdateDepotComponent } from 'src/app/Dialogs/update-depot/update-depot.component';

import { ErrorsComponent } from 'src/app/Dialogs/errors/errors.component';
import { Router } from '@angular/router';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';

@Component({
  selector: 'app-entropot',
  templateUrl: './entropot.component.html',
  styleUrls: ['./entropot.component.css']
})
export class EntropotComponent implements OnInit{
depots : Depot[] =[];
constructor(private _enttservice :EntropotService,
  private dialog: MatDialog,
  private snackBar:MatSnackBar,
  private router: Router){}
openAddentropotDialog():void{
  const dialogref = this.dialog.open(AddDepoComponent,{
    width:'50%',
    enterAnimationDuration:'1000ms',
    exitAnimationDuration:'200ms',
  });
  dialogref.afterClosed().subscribe(result =>{
    if (result){
      this.depots.push(result);
    }
  })
}
ngOnInit(): void {
    this.fetchEntropots();
}
fetchEntropots():void{
  this._enttservice.getAllentrp().subscribe((depot)=>{
    this.depots=depot;
  },(error)=> {
      this.openErrorDialog('Erreur l\'ors de l\'affichage de liste des entropots','backend Error');
    console.log(error)});
}
public deleteEntrp(id: number): void {
  const deleteDialog = this.dialog.open(ConfirmationComponent, {
    data: { message: 'Êtes-vous sûr de vouloir supprimer ce dépôt ?' ,title:"Delete"},
  });

  deleteDialog.afterClosed().subscribe((res) => {
    if (res === 'confirm') {
      this._enttservice.deleteEntrp(id).subscribe({
        next: () => {
          this.snackBar.openFromComponent(SuccessToastComponent, {
            data: { message: 'Le dépôt a été supprimé avec succès' },
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['snack-green', 'snack-size', 'snack-position']
          });
          this.depots = this.depots.filter(dep => dep.id !== id);     
        },
        error: (error) => {
          if (error.status === 409) {
            const warningDialog = this.dialog.open(WarningToastComponent, {
              data: { message: 'Ce dépôt est associé à des lignes. Voulez-vous quand même le supprimer ?',title:"Warning" },
            });

            warningDialog.afterClosed().subscribe((res) => {
              if (res === 'confirm') {
                this._enttservice.deleteEntrp(id,true).subscribe({
                  next: () => {
                    this.openToast("Le dépôt a été supprimé avec succès")
                    this.depots = this.depots.filter(dep => dep.id !== id);                   
                  },
                  error: (error) => {
                    const errorMessage = `Failed to delete warehouse : ${error.status}`;
                    this.openfailToast(errorMessage)
                  }
                });
              }
            });
          } else {
            const errorMessage = `Failed to delete warehouse : ${error.status}`;
            this.openfailToast(errorMessage)
          }
        }
      });
    }
  });
}

openEditDepotDialog(depot:Depot):void{
  const dialogref = this.dialog.open(UpdateDepotComponent,{
    width: '50%',
    data :{depot:depot},
    enterAnimationDuration:'1000ms',
    exitAnimationDuration:'2000ms',
  });
}
openToast(message: string): void {
  const dialogRef = this.dialog.open(SuccessToastComponent, {
    width: '350px',
    data: { message: message },
    
  });
  dialogRef.afterOpened().subscribe(() => {
    setTimeout(() => {
      setTimeout(() => {
        dialogRef.close();
      }, 300); 
    }, 5000);
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
openErrorDialog(message:string,title:string){
 const currentpage = this.router.url;
  if (currentpage === '/entropot'){
  const dialog = this.dialog.open(ErrorsComponent,{
    data:{message:message,title:title},
  });
  dialog.afterClosed().subscribe((result) => {
      setTimeout(() => {
        this.openErrorDialog(message, title);
      }, 3000);
  });}

}

}
