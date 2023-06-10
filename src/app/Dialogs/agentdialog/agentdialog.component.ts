import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserServiceService } from 'src/app/Core/Services/user-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleService } from 'src/app/Core/Services/role.service';
import { Role } from 'src/app/Core/interfaces/Role';

@Component({
  selector: 'app-agentdialog',
  templateUrl: './agentdialog.component.html',
  styleUrls: ['./agentdialog.component.css']
})
export class AgentdialogComponent implements OnInit{
  selected :String;
  roleList: Role[] = [];
  updateForm: FormGroup;
  checked: boolean = false;
  selectedImage: File;
  constructor(
    public dialogRef: MatDialogRef<AgentdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: UserServiceService,private _roleservice : RoleService
  
  ) {
    const agent:any = data.agent;

    this.updateForm = fb.group({
      imageUrl:[agent.imageUrl],
      id: [agent.id],
      name: [agent.name],
      prenom: [agent.prenom],
      email: [agent.email],
      username: [agent.username],
      roleName :[agent.roleName],
      roles: [agent.roles],
      password: [''],
      //role: [user.role, Validators.required],
    });
   
    this.updateForm.controls['email'].setValidators([
      Validators.required,
      Validators.email,
    ]);
   
  }

ngOnInit(): void {
  this._roleservice.getRoles().subscribe((roles) => {
    this.roleList =roles;
  });
}
  annuler() {
    this.dialogRef.close();
  }

  onFileChange(event){
    
    const file = event.target.files[0];
    this.selectedImage=file;
  }
 public updateUser() {
    const agent = this.updateForm.getRawValue();
    this.service.updateAgent(this.data.agent.id,agent).subscribe((res) => {
      
      console.log("agent updated",res);
      this.dialogRef.close(res);
    },
    (error)=>{
      console.log("error updating agent",error)
    });
  
  }
  uploadImage(){
    const imagedata = new FormData();
    imagedata.append('image',this.selectedImage,this.selectedImage.name);
    this.service.uploadimage(this.data.agent.id,this.selectedImage).subscribe((res)=>{
      console.log("image uploaded",res);
    },
    (error)=>{
      console.log("failed to upload",error);
    });

  }


public patchAgent():void{
  const patchagent :any ={};
  const values = this.updateForm.getRawValue();
  Object.keys(values).forEach((key)=>{
    if (values[key] !== this.data.agent[key] && values[key] !== null && values[key] !== '') {  // Only include modified fields
      patchagent[key] = values[key];
    }
  });

  console.log('Patch agent:', patchagent);
  this.service.patchAgent(this.data.agent.id,patchagent).subscribe((res)=>{
    console.log("agent patched",res);
    this.dialogRef.close(res);
  },
  (error)=>{
    console.log("error patching agent",error);
  })
}
 



}
