import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { GlobalService } from 'src/app/global.service';
import { UserServiceService } from '../../Services/user-service.service';
import { UpdateToastComponent } from 'src/app/alerts/update-toast/update-toast.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{
  selectedfile:string ='';
  updateForm: FormGroup;
  imageSizeError: String;
 public userinfo :any;
  selectedImage: File;
  oldPasswordValid = false;
  constructor(private fb:FormBuilder,private gs:GlobalService,private service:UserServiceService,private snackBar:MatSnackBar) {
    this.updateForm = fb.group({
      id:[''],
      name: [''],
      imageUrl:[''],
      surname: [''],
      username: [''],
      phone:[''],
      newPassword: [''],
      password : [''],
    });
  }
  ngOnInit(): void {
    this.userinfo = this.gs.getUserDetails();
    console.log(this.userinfo);
    if (this.userinfo) {
      this.updateForm.patchValue({
        imageUrl:this.userinfo.imageUrl,
        id:this.userinfo.id,
        name: this.userinfo.name,
        surname: this.userinfo.surname,
        username: this.userinfo.username,
        phone: this.userinfo.phone,
      });
    }    
    console.log(this.updateForm.value)
  }

  onfileRead(event:any){
    const file: File = event.target.files[0];
  
  const reader = new FileReader();

  reader.onload = (e: any) => {
    this.selectedfile = e.target.result;
  };

  reader.readAsDataURL(file);
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

  public patchAgent(): void {
    const formvalue = this.updateForm.value;
    this.service.updateAgent(this.userinfo.id,formvalue).subscribe((res)=>{
      console.log("updated :",res);
    },(err)=>{
      console.log("error : ",err);
    })
 /*   const newpass = this.updateForm.get('password').value;
    var formdata = new FormData();
    const values = this.updateForm.getRawValue();
    Object.keys(values).forEach((key) => {
      if (values[key] !== this.userinfo[key] && values[key] !== null && values[key] !== '') {
        console.log("82 :  ",this.userinfo[key]);
        if (key === 'file') {
          const files = values[key] as File[];
          if (files && files.length > 0) {
            files.forEach((file) => {
              formdata.append('image', file, file.name);
            });
          }
          
        }
        
        else if (key ==='password'){
          if (this.checkIfPassMatch())
          formdata.append('password',newpass);
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
      this.service.patchAgentimg(this.userinfo.id, formdata, this.selectedImage).subscribe((res) => {
       
        this.openToast("agent a été mis à jour");
      
      }, (error) => {
        console.log("error patching agent avec image ", error);
      });
    } else
      this.service.patchAgentimg(this.userinfo.id, formdata).subscribe((res) => {
       this.openToast("agent a été mis à jour");
      
      }, (error) => {
        console.log("error patching agent sans image", error);
      });*/
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
}
