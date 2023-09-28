import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConductorService } from 'src/app/Core/Services/conductor.service';
import { Conductor } from 'src/app/Core/Models/Conductor';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';
import { Depot } from 'src/app/Core/Models/depot';
import { Observable, map, startWith } from 'rxjs';
import { EntropotService } from 'src/app/Core/Services/entropot.service';

@Component({
  selector: 'app-add-conductor',
  templateUrl: './add-conductor.component.html',
  styleUrls: ['./add-conductor.component.css']
})
export class AddConductorComponent implements OnInit{

  Conductors: Conductor[] = [];
  addForm: FormGroup;
  warehouse: Depot[] = [];
  isFormSubmitted = false;
  showdialg: boolean = true;
  filteredOptions: Observable<Depot[]>;
  entrpt = new FormControl<Depot>(null);
  constructor(private dialog: MatDialog,private _warehouseService:EntropotService,
    private _conductorservice: ConductorService,
    private fb: FormBuilder, private snackBar: MatSnackBar) {

    this.addForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      uid: new FormControl('', [Validators.required, Validators.minLength(4)]),
      type: [null],
      warehouse:new FormControl(this.entrpt,Validators.required),
    })
  }

  ngOnInit(): void {
    this._warehouseService.getAllentrp().subscribe(warehouses => {
      this.warehouse = warehouses;
    })
    this.filteredOptions = this.entrpt.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.warehouse.slice();
      })
    );
  }
  private _filter(name: string): Depot[] {
    const filterValue = name.toLowerCase();

    return this.warehouse.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  displayFn(entropot: Depot): string {
    return entropot && entropot.name ? entropot.name : '';
  }
  add() {
    const formvalue = this.addForm.value;
    const selectedMaker :Depot = this.entrpt.value;
    formvalue.warehouse = selectedMaker;
    this.isFormSubmitted = true;
    const formValue = this.addForm.value;
    if (this.addForm.valid) {
      this._conductorservice.addconductor(formValue).subscribe(() => {
        this.openAddToast('Conducteur ajoué avec success');
       this.close();
      })
    }else
    this.openWarningToast("Verifier tous les chanps");
  }
  close() {
    this.dialog.closeAll()
  }
  openAddToast(message: string) {
    this.snackBar.openFromComponent(SuccessToastComponent, {
      data: { message: message },
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: ['snack-green', 'snack-size', 'snack-position']
    })
  }
  openfailToast(message: string): void {
    this.snackBar.openFromComponent(FailedToastComponent, {
      data: { message: message }, duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "bottom",
      panelClass: ['snack-red', 'snack-size']
    });
  }
  openWarningToast(message: string): void {
    this.snackBar.openFromComponent(WarningToastComponent, {
      data: { message: message },
      duration: 5000,
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: ['snack-yellow', 'snack-size']
    });
  }
  dismissdialog() {
    this.showdialg = false;
  }
}
