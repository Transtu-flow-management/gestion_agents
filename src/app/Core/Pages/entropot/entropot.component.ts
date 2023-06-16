import { Component } from '@angular/core';
import { Depot } from '../../interfaces/depot';
import { MatDialog } from '@angular/material/dialog';
import { EntropotService } from '../../Services/entropot.service';
import { AddDepoComponent } from 'src/app/Dialogs/add-depo/add-depo.component';

@Component({
  selector: 'app-entropot',
  templateUrl: './entropot.component.html',
  styleUrls: ['./entropot.component.css']
})
export class EntropotComponent {
depots : Depot[] =[];
constructor(private _enttservice :EntropotService,private dialog: MatDialog){}
openAddentropotDialog():void{
  const dialogref = this.dialog.open(AddDepoComponent,{
    height:'60%',
    width:'50%',
    enterAnimationDuration:'1000ms',
    exitAnimationDuration:'200ms',

  })
}
}
