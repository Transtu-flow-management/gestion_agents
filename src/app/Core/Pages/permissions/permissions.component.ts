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
  selectedPerm : String[]=[]
  constructor(private _permissionservice : PermissionService){}
  @Output() selectedPermissions: EventEmitter<String[]> = new EventEmitter<String[]>();
  @Input() assignedPermissions: String[];
  ngOnInit(): void {
      this.fetchpermissions()
      
  }

  public fetchpermissions(): void {
    this._permissionservice.fetchpermissions().subscribe(
      (res) => {
        
        this.permissions = res
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

  
  public onpress():void{
   const selectedbox = this.permissions.filter(permission=>permission.selected);
   this.selectedPerm = selectedbox.map(perm => perm.permissionName);
   this.selectedPermissions.emit(this.selectedPerm)
    console.log('selected permissions : '+this.selectedPerm);
  }


}