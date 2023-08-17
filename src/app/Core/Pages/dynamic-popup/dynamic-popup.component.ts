import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: '[app-dynamic-popup]',
  templateUrl: './dynamic-popup.component.html',
  styleUrls: ['./dynamic-popup.component.css']
})
export class DynamicPopupComponent implements OnInit{
  @Input() addForm!: FormGroup;
  @Input() isFormSubmitted: boolean = false;
  typeFormControl: FormControl;
  @Output() stopNameSaved = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder,public viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      startFr: ['', [Validators.required, Validators.minLength(4)]],
      startAr: ['', [Validators.required, Validators.minLength(4)]],
      type: [null, Validators.required]
    });
    this.typeFormControl = this.addForm.get('type') as FormControl;
  }
  onFormSubmit() {
    if (this.addForm.valid) {
      const stopName = this.addForm.get('startFr').value; // Adjust this based on your form structure
      this.stopNameSaved.emit(stopName);
    }
  }
}
