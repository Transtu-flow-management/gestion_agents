import { Component,OnInit } from '@angular/core';
import { Depot } from '../../interfaces/depot';
import { MatDialog } from '@angular/material/dialog';
import { EntropotService } from '../../Services/entropot.service';
import { AddDepoComponent } from 'src/app/Dialogs/add-depo/add-depo.component';
import { HttpClient } from '@angular/common/http';
import { UpdateDepotComponent } from 'src/app/Dialogs/update-depot/update-depot.component';

import { ErrorsComponent } from 'src/app/Dialogs/errors/errors.component';
import { Router } from '@angular/router';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';

@Component({
  selector: 'app-entropot',
  templateUrl: './entropot.component.html',
  styleUrls: ['./entropot.component.css']
})
export class EntropotComponent implements OnInit{
depots : Depot[] =[];
constructor(private _enttservice :EntropotService,private dialog: MatDialog,private http :HttpClient,private router: Router){}
openAddentropotDialog():void{
  const dialogref = this.dialog.open(AddDepoComponent,{
    height:'90%',
    width:'70%',
    enterAnimationDuration:'1000ms',
    exitAnimationDuration:'200ms',

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
public deleteEntrp( id:Number):void{
  this._enttservice.deleteEntrp(id).subscribe((del)=>{
    if(confirm('delete entropot !'))
    this.openToast('success','entropot supprimé');
  },(error)=>{
    console.log("entropot non supprimé",error);
  })
}
openEditDepotDialog(depot:Depot):void{
  const dialogref = this.dialog.open(UpdateDepotComponent,{
    width: '100%',
    data :{depot:depot},
  });
}
openToast(title:string,message: string): void {
  const dialogRef = this.dialog.open(SuccessToastComponent, {
    width: '350px',
    data: { title: title, message: message },
    
  });
  dialogRef.afterOpened().subscribe(() => {
    setTimeout(() => {
      setTimeout(() => {
        dialogRef.close();
      }, 300); 
    }, 5000);
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
