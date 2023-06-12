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
  imageSizeError: String;
  selectedImage: File ;
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
        } else {
          // Only include modified fields
          formdata.append(key, values[key]);
          
        }
      }
    });
  
    formdata.forEach((value, key) => {
      console.log(key, value);
    });
   if(this.selectedImage){
    this.service.patchAgentimg(this.data.agent.id,formdata, this.selectedImage).subscribe((res) => {
      console.log("agent patched", res);
      this.dialogRef.close(res);
    }, (error) => {
      console.log("error patching agent", error);
    });}else
    this.service.patchAgentimg(this.data.agent.id, formdata).subscribe((res) => {
      console.log("agent patched sans image", res);
      this.dialogRef.close(res);
    }, (error) => {
      console.log("error patching agent no image", error);
    });
  }
  



}
