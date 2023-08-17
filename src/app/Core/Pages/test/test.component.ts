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

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{
  entrpt = new FormControl<Depot>(null);
  filteredOptions: Observable<Depot[]>;
  warehouse : Depot[] =[];
  selected :String;
   constructor(private _roleService : RoleService, private _Agentservice : UserServiceService){
    
  }
  ngOnInit(): void {
    this.filteredOptions = this.entrpt.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.warehouse.slice();
      })
    );
  }

  displayFn(entropot: Depot): string {
    return entropot && entropot.name ? entropot.name : '';
  }
  private _filter(name: string): Depot[] {
    const filterValue = name.toLowerCase();

    return this.warehouse.filter(option => option.name.toLowerCase().includes(filterValue));
  }

}
