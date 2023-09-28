import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {map, startWith} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { EntropotService } from 'src/app/Core/Services/entropot.service';
import { LinesService } from 'src/app/Core/Services/lines.service';
import { Depot } from 'src/app/Core/Models/depot';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';
import { WarningComponent } from 'src/app/alerts/warning/warning.component';

@Component({
  selector: 'app-add-line',
  templateUrl: './add-line.component.html',
  styleUrls: ['./add-line.component.css']
})
export class AddLineComponent implements OnInit{
  horizontalPosition: MatSnackBarHorizontalPosition
  verticalPosition: MatSnackBarVerticalPosition 
  entrpt = new FormControl<Depot>(null);
  warehouse : Depot[]= [];
  filteredOptions: Observable<Depot[]>;

  addForm: FormGroup;
  isFormSubmitted = false;
  showdialg: boolean = true;
  
  constructor(private dialog :MatDialog,private fb:FormBuilder,private snackBar:MatSnackBar ,private _lineservice :LinesService,private _warehouseService:EntropotService){
     this.addForm = this.fb.group({
      nameFr: new FormControl('', [Validators.required,]),
      nameAr: new FormControl('', [Validators.required,this.arabicTextValidator()]),
      start_fr: new FormControl('', [Validators.required, ]),
      start_ar: new FormControl('', [Validators.required,this.arabicTextValidator()]),
      end_fr: new FormControl('', [Validators.required,]),
      end_ar: new FormControl('', [Validators.required, this.arabicTextValidator()]),
      warehouse:  new FormControl(this.entrpt, [Validators.required])
    });
    this._warehouseService.getAllentrp().subscribe(warehouses => {
      this.warehouse = warehouses;
    });
  }
  arabicTextValidator() {
    return (control) => {
      const arabicTextPattern = /^[\u0600-\u06FF\s]+$/;
      if (!arabicTextPattern.test(control.value)) {
        return { notArabic: true };
      }
      return null;
    };
  }
  ngOnInit() {
    this.filteredOptions = this.entrpt.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.warehouse.slice();
      })
    );
  }
  displayFn(entropot: Depot): string {
    return entropot && entropot.name ? entropot.name : '';
  }
  private _filter(name: string): Depot[] {
    const filterValue = name.toLowerCase();

    return this.warehouse.filter(option => option.name.toLowerCase().includes(filterValue));
  }


  close()
  {
     this.dialog.closeAll()
   }
  dismissdialog(){
    this.showdialg = false;    
  }
  openAddToast(message:string){
    this.snackBar.openFromComponent(SuccessToastComponent,{
      data :{message:message},
      duration:5000,
      horizontalPosition:"end",
      verticalPosition:"top",
      panelClass: ['snack-green','snack-size','snack-position']
    })
   }
 openfailToast(message: string): void {
  this.snackBar.openFromComponent(FailedToastComponent, {
   data: {message: message },
   duration: 3000,
   horizontalPosition: "end",
   verticalPosition: "bottom",
   panelClass: ['snack-red','snack-size']
 });
}

openWarningToast(message:string):void{
 this.snackBar.openFromComponent(WarningComponent,{
   data: {message:message},duration: 5000,
 horizontalPosition: "center",
    verticalPosition: "top",
    panelClass : ['snack-yellow','snack-size']
});
}

add(): void {
  this.isFormSubmitted = true;
  const formValue = this.addForm.value;
  const selectedMaker :Depot = this.entrpt.value;
  formValue.warehouse = selectedMaker;

  if (this.addForm.invalid){
    return this.openWarningToast('Form invalide');
  }
    this._lineservice.addline(formValue).subscribe(() => {
      this.openAddToast('ligne ajoutée avec succès');
      this.close();
    }, (error) => {
      this.openfailToast('Erreur lors de l\'ajout d\'une ligne');
      console.log(error);
    });
}
}
