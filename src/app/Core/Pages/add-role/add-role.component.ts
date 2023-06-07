import { Component, OnInit,Input} from '@angular/core';
import {Modal,Ripple,initTE,} from "tw-elements";
import { RoleService } from '../../Services/role.service';
import { Role } from '../../interfaces/Role';
@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit{
  @Input() isOpen = false;
  roleName : String = '';
  constructor(private _roleservice: RoleService){
  }

ngOnInit(): void {
  initTE({ Modal, Ripple });
}
Annuler():void{
  this.roleName ='';
}
Ajouter():void{
 if (this.roleName){
  const newRole : Role = {
    id: null,
    dateOfCreation : new Date(),
    dateOfModification :null,
    roleName:this.roleName,
    permissions : []
  };
  this._roleservice.createRole(newRole).subscribe(res => console.log("role ajouté"))
 }

 
}
}
