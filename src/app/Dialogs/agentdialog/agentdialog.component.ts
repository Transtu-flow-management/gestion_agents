import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserServiceService } from 'src/app/Core/Services/user-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-agentdialog',
  templateUrl: './agentdialog.component.html',
  styleUrls: ['./agentdialog.component.css']
})
export class AgentdialogComponent implements OnInit{

  updateForm: FormGroup;
  checked: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AgentdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: UserServiceService,
  
  ) {
    const agent:any = data.agent;
    this.updateForm = fb.group({
      id: [agent.id],
      name: [agent.name],
      prenom: [agent.prenom],
      email: [agent.email],
      username: [agent.username],
      dateOfInsertion : [agent.dateOfInsertion],
      dateOfModification : [agent.dateOfModification],
      roleName :[agent.roleName],
      //password: [''],
      //role: [user.role, Validators.required],
    });
   
    this.updateForm.controls['email'].setValidators([
      Validators.required,
      Validators.email,
    ]);
    
  }

  ngOnInit(): void {
  }

  annuler() {
    this.dialogRef.close();
  }


 public updateUser() {
    const agent = this.updateForm.getRawValue();
    this.service.updateAgent(this.data.agent.id,agent).subscribe((res) => {
      this.dialogRef.close(res);
    });
  }

 



}
