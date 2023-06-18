import { Component,OnInit } from '@angular/core';
import { Depot } from '../../interfaces/depot';
import { MatDialog } from '@angular/material/dialog';
import { EntropotService } from '../../Services/entropot.service';
import { AddDepoComponent } from 'src/app/Dialogs/add-depo/add-depo.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-entropot',
  templateUrl: './entropot.component.html',
  styleUrls: ['./entropot.component.css']
})
export class EntropotComponent implements OnInit{
depots : Depot[] =[];
constructor(private _enttservice :EntropotService,private dialog: MatDialog,private http :HttpClient){}
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
  },(error)=> {console.log("error featching depots ",error)});
}
public deleteEntrp( id:Number):void{
  this._enttservice.deleteEntrp(id).subscribe((del)=>{
    if(confirm('delete entropot !'))
    alert('entropot supprimé');
  },(error)=>{
    console.log("entropot non supprimé",error);
  })
}
}
