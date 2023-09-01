import { Component, OnInit,Inject } from '@angular/core';

import { IPermissions, Role } from '../../Models/Role';

import { PermissionService } from '../../Services/permission.service';
import { RoleService } from '../../Services/role.service';
import { UserServiceService } from '../../Services/user-service.service';
import { AssignRoledialogComponent } from 'src/app/Dialogs/assign-roledialog/assign-roledialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Depot } from '../../Models/depot';
import { Observable, map, startWith } from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Stop } from '../../Models/Stop';
import { StopserviceService } from '../../Services/stopservice.service';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{
  entrpt = new FormControl<Depot>(null);
  filteredOptions: Observable<Depot[]>;
  stops : Stop[] =[];
  selected :String;
   constructor(private stopservice : StopserviceService, private _Agentservice : UserServiceService){
    
  }
  ngOnInit(): void {
   this.stopservice.getstopsall().subscribe((s =>{
    this.stops = s;
   }))
  }


  drop(event: CdkDragDrop<Stop[]>) {
    if (event.previousContainer === event.container){
    moveItemInArray(this.stops, event.previousIndex, event.currentIndex);
  }else{
    transferArrayItem(event.previousContainer.data,this.stops,event.previousIndex,event.currentIndex);
  }
  }

}
