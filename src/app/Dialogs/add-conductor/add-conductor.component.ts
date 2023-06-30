import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConductorService } from 'src/app/Core/Services/conductor.service';
import { Conductor } from 'src/app/Core/interfaces/Conductor';

@Component({
  selector: 'app-add-conductor',
  templateUrl: './add-conductor.component.html',
  styleUrls: ['./add-conductor.component.css']
})
export class AddConductorComponent {
  Conductors : Conductor []= [];
  addForm: FormGroup;
  isFormSubmitted = false;
  showdialg: boolean = true;
  constructor(private dialog : MatDialog,private _conductorservice:ConductorService,private fb:FormBuilder){ 

    this.addForm = this.fb.group({
      name:  new FormControl('', [Validators.required, Validators.minLength(6)]),
      surname :  new FormControl('', [Validators.required, Validators.minLength(6)]),
      uid :  new FormControl('', [Validators.required, Validators.minLength(4)]),
    })

  }
  add(){}
  close(){}
  dismissdialog(){}
}
