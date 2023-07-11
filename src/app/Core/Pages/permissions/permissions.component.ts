import { Component,OnInit,EventEmitter,Output,Input } from '@angular/core';
import { IPermissions } from '../../interfaces/Role';
import { PermissionService } from '../../Services/permission.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit  {
  permissions: IPermissions[]=[];
  selectedPerm : string[]=[];
  isButtonDisabled:boolean= false;
  checkcount: number = 0;
  groupedPermissions: { [type: string]: IPermissions[] } = {};
  constructor(private _permissionservice : PermissionService){
   this.groupPermissionsBytype();
  }
  @Output() selectedPermissions: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Input() assignedPermissions: String[];
  @Input() isDialogOpen: boolean;
  
  ngOnInit(): void {
      this.fetchpermissions()
      this.selectedPermissions.emit(this.selectedPerm);
      
  }
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  public fetchpermissions(): void {
    this._permissionservice.fetchpermissions().subscribe(
      (res) => {
        
        this.permissions = res
        this.groupPermissionsByGroup();
        for (let v of this.permissions){
          if (this.assignedPermissions.includes(v.TYPE)){
            v.selected=true;
          }
        }
        
      },
      (error) => {
        console.log('Error fetching permissions', error);
      }
    );
  }
  
  selectAllPermissions() {
    for (const group of this.getObjectKeys(this.groupedPermissions)) {
      for (const permission of this.groupedPermissions[group]) {
        permission.selected=true;
        if (permission.selected) {
          this.selectedPerm.push(permission.permissionName);
        }
      }
    }
  }
  unselectAllPermissions() {
    for (const group of this.getObjectKeys(this.groupedPermissions)) {
      for (const permission of this.groupedPermissions[group]) {
        permission.selected = false;
      
      }
    }
  }
  isAllSelected(): boolean {
    for (const group of this.getObjectKeys(this.groupedPermissions)) {
      for (const permission of this.groupedPermissions[group]) {
        if (!permission.selected) {
          return false;
        }
      }
    }
    return true;
  }

  groupPermissionsBytype(): void {
    this.permissions.forEach(permission => {
      const type = permission.TYPE;
      if (!this.groupedPermissions[type]) {
        this.groupedPermissions[type] = [];
      }
      this.groupedPermissions[type].push(permission);
    });
  }
  groupPermissionsByGroup(): void {
    this.permissions.forEach(permission => {
      const type = permission.group;
      if (!this.groupedPermissions[type]) {
        this.groupedPermissions[type] = [];
      }
      this.groupedPermissions[type].push(permission);
    });
  }
  public checkboxChanged(): void {
    this.checkcount = this.permissions.filter(permission => permission.selected).length;
    const selectedbox = this.permissions.filter(permission=>permission.selected);
    this.selectedPerm = selectedbox.map(perm => perm.permissionName);
    this.selectedPermissions.emit(this.selectedPerm)
     console.log('selected permissions : '+this.selectedPerm);
  }
  
  


}