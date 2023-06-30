import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { BrandService } from 'src/app/Core/Services/brand.service';
import { Brand, Maker } from 'src/app/Core/interfaces/brand';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.css']
})

export class AddBrandComponent implements OnInit{
  horizontalPosition: MatSnackBarHorizontalPosition
  verticalPosition: MatSnackBarVerticalPosition 
  fabriquants = new FormControl<Maker>(null);
  makers : Maker[]= [];
  filteredOptions: Observable<Maker[]>;

  addForm: FormGroup;
  isFormSubmitted = false;
  showdialg: boolean = true;
  
  constructor(private dialog :MatDialog,private fb:FormBuilder,private snackBar:MatSnackBar,private router:Router ,private _brandservice :BrandService){
     this.addForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(6)]),
      maker: this.fabriquants,
    });
    this._brandservice.getAllmakers().subscribe(makers => {
      this.makers = makers;
    });
  }
  ngOnInit() {
    this.filteredOptions = this.fabriquants.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.makers.slice();
      })
    );
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
 });
}

add(): void {
  this.isFormSubmitted = true;
  const formValue = this.addForm.value;
  
  if (this.addForm.valid) {
    
    const selectedMaker = this.fabriquants.value;
      formValue.fabriquant = selectedMaker.name;
      console.log(selectedMaker)
   /* this._brandservice.createBrand(formValue).subscribe(() => {
      this.openAddToast('Marque ajoutée avec succès');
     
      this.router.navigate(['/marque']);
    }, (error) => {
      this.openfailToast('Erreur lors de l\'ajout d\'une Marque');
      console.log(error);
    });*/
  }
}
}
