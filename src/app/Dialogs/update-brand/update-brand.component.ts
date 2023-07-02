import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { BrandService } from 'src/app/Core/Services/brand.service';
import { Brand, Maker } from 'src/app/Core/interfaces/brand';

import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { UpdateToastComponent } from 'src/app/alerts/update-toast/update-toast.component';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';

@Component({
  selector: 'app-update-brand',
  templateUrl: './update-brand.component.html',
  styleUrls: ['./update-brand.component.css']
})
export class UpdateBrandComponent implements OnInit{
  horizontalPosition: MatSnackBarHorizontalPosition
  verticalPosition: MatSnackBarVerticalPosition 
  fabriquants = new FormControl<Maker>(null);

  makers : Maker[]= [];
  filteredOptions: Observable<Maker[]>;
  updateForm: FormGroup;
  isFormSubmitted = false;
  showdialg: boolean = true;
  
  constructor(private dialog :MatDialog,
    private fb:FormBuilder,private snackBar:MatSnackBar ,
    private _brandservice :BrandService,
    public dialogRef: MatDialogRef<UpdateBrandComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
  
      const brand :any = data.brand;  
      
    this.updateForm = this.fb.group({

      name: new FormControl(brand.name, [Validators.required, Validators.minLength(6)]),
      builder:   new FormControl(this.fabriquants, [Validators.required])
    });
   

  }
ngOnInit(): void {

  this.filteredOptions = this.fabriquants.valueChanges.pipe(
    startWith(''),
    map(value => {
      const name = typeof value === 'string' ? value : value?.name;
      return name ? this._filter(name as string) : this.makers.slice();
    })
  );
  this._brandservice.getAllmakers().subscribe(maker => {
    this.makers = maker;
  });
}


  displayFn(maker: Maker): string {
    return maker && maker.name ? maker.name : '';
  }
  private _filter(name: string): Maker[] {
    const filterValue = name.toLowerCase();
    return this.makers.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  close()
  {
     this.dialog.closeAll()
   }
  dismissdialog(){
    this.showdialg = false;    
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
openErrorToast(message:string){
  this.snackBar.openFromComponent(FailedToastComponent,{
    data :{message:message},
    duration:3000,
    horizontalPosition: "end",
    verticalPosition: "bottom",
    panelClass : ['snack-red','snack-size']
});
}

 isFormUnchanged(){
  var brand = this.updateForm.getRawValue();
  const checkvalues = this.data.brand;

  return brand.name === checkvalues.name && brand.builder === checkvalues.builder;
 }
public update():void{
  var brand =this.updateForm.getRawValue();
  const fabriquantValue = this.fabriquants.value;
  console.log(fabriquantValue);
  console.log(brand);
  if (fabriquantValue !== this.data.brand.builder){ 
    brand.builder = fabriquantValue;
  }
    else{
      brand.builder = this.data.brand.builder;
    }
    console.log(brand);
  this._brandservice.updatebrand(this.data.brand.id,brand).subscribe(()=>{
    this.openToast('La marque a été mis à jour')
    this.dialogRef.close();
  },(error)=>{
    console.log("error updating",error);
  });

}
 
}
