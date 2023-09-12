import { Component,ViewChild,ElementRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserServiceService } from 'src/app/Core/Services/user-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleService } from 'src/app/Core/Services/role.service';
import { Role } from 'src/app/Core/Models/Role';
import { UpdateToastComponent } from 'src/app/alerts/update-toast/update-toast.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Depot } from 'src/app/Core/Models/depot';
import { EntropotService } from 'src/app/Core/Services/entropot.service';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-agentdialog',
  templateUrl: './agentdialog.component.html',
  styleUrls: ['./agentdialog.component.css']
})
export class AgentdialogComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  selected: String;
  selectedRoleId: Number;
  roleList: Role[] = [];
  warehouselist : Depot [] = [];
  updateForm: FormGroup;
  uploadedImage: string | ArrayBuffer | null = null;
  checked: boolean = false;
  imageSizeError: String;
  selectedImage: File;
  selectedfile:string ='';
  constructor(
    public dialogRef: MatDialogRef<AgentdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: UserServiceService, private _roleservice: RoleService, private _whservice:EntropotService,
    private snackBar:MatSnackBar

  ) {
    const agent: any = data.agent;

    this.updateForm = fb.group({
      imageUrl: [agent.imageUrl],
      id: [agent.id],
      name: [agent.name],
      surname: [agent.surname],
      username: [agent.username],
      phone:[agent.phone],
      roleName: [agent.roleName],
      roles: [agent.role],
      warehouse : [agent.depot],
      warehouseName :[agent.warehouseName],
      password: [''],
      //role: [user.role, Validators.required],
    });

    this.updateForm.controls['username'].setValidators([
      Validators.required,
      Validators.email,
    ]);

  }

  ngOnInit(): void {
    this._roleservice.getRoles().subscribe((roles) => {
      this.roleList = roles;
      this.getallwarehouses();
    });
  }
  annuler() {
    this.dialogRef.close();
  }

  onFileChange(event) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.selectedImage = files[0];
      const file: File = files[0];
      const fileSizeInBytes = file.size;
      const maxSizeInBytes = 1048576;
      if (fileSizeInBytes > maxSizeInBytes) {
        this.imageSizeError = 'The selected image exceeds the maximum allowed size.';
        // Reset the selected image
        this.selectedImage = null;
      } else {
        this.selectedImage = file;
        this.imageSizeError = null;
      }
    }
  }
  onfileRead(event:any){
    const file: File = event.target.files[0];
  
  const reader = new FileReader();

  reader.onload = (e: any) => {
    this.selectedfile = e.target.result;
  };

  reader.readAsDataURL(file);
  }

  public updateUser() {
    const agent = this.updateForm.getRawValue();
    this.service.updateAgent(this.data.agent.id, agent).subscribe((res) => {

      console.log("agent updated", res);
      this.dialogRef.close(res);
    },
      (error) => {
        console.log("error updating agent", error)
      });

  }

  openToast(message: string): void {
    this.snackBar.openFromComponent(UpdateToastComponent,{
      data :{message:message},
      duration:3000,
      horizontalPosition:"end",
      verticalPosition:"top",
      panelClass: ['snack-green','snack-size','snack-position']
    })
 }

  public patchAgent(): void {
    var formdata = new FormData();
    var patchagent: any = {};
    const values = this.updateForm.getRawValue();
    Object.keys(values).forEach((key) => {
      if (values[key] !== this.data.agent[key] && values[key] !== null && values[key] !== '') {

        if (key === 'file') {
          const files = values[key] as File[];
          if (files && files.length > 0) {
            files.forEach((file) => {
              formdata.append('image', file, file.name);
              console.log('file: ', formdata);
            });
          }
          
        }
       else if (key ==='roles') {
        var roleId = values[key];
        const selectedRole = this.roleList.find(role => role.id === roleId);
        if (selectedRole) {
          values.roles = [];
          values.roles.push(selectedRole.id); 
          formdata.append('roles', values.roles[0]);
        }
        }
        else if (key ==='warehouse') {
          var whId = values[key];
          const selectedwH = this.warehouselist.find(wh => wh.id === whId);
          if (selectedwH) {
            values.warehouse = [];
            values.warehouse.push(selectedwH.id); 
            formdata.append('warehouse', values.warehouse[0]);
          }
          }
        else {
          formdata.append(key, values[key]);

        }
      }
    });

    formdata.forEach((value, key) => {
      console.log(key, value);
    });
    if (this.selectedImage) {
      this.service.patchAgentimg(this.data.agent.id, formdata, this.selectedImage).subscribe((res) => {
       
        this.openToast("agent a été mis à jour");
        this.dialogRef.close(res);
      }, (error) => {
        console.log("error patching agent avec image ", error);
      });
    } else
      this.service.patchAgentimg(this.data.agent.id, formdata).subscribe((res) => {
       this.openToast("agent a été mis à jour");
        this.dialogRef.close(res);
      }, (error) => {
        console.log("error patching agent sans image", error);
      });

  }
  
  getallwarehouses():void{
    this._whservice.getAllentrp().subscribe((wh : Depot[])=>{
      this.warehouselist = wh;
    })
  }
}
