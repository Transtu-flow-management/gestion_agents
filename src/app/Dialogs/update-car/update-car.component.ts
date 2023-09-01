import { Component, Inject, OnInit } from '@angular/core';
import { Observable, map, startWith } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Conductor } from 'src/app/Core/Models/Conductor';
import { Brand } from 'src/app/Core/Models/brand';
import { Depot } from 'src/app/Core/Models/depot';
import { CarService } from 'src/app/Core/Services/car.service';
import { Lines } from 'src/app/Core/Models/Lines';
import { Condition } from 'src/app/Core/Models/condition';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EntropotService } from 'src/app/Core/Services/entropot.service';
import { ConductorService } from 'src/app/Core/Services/conductor.service';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';
import { UpdateToastComponent } from 'src/app/alerts/update-toast/update-toast.component';
import { Path } from 'src/app/Core/Models/Path';
import { WarningComponent } from 'src/app/alerts/warning/warning.component';

@Component({
  selector: 'app-update-car',
  templateUrl: './update-car.component.html',
  styleUrls: ['./update-car.component.css']
})
export class UpdateCarComponent implements OnInit{

  options= [
    {title :'Standard',value:0},
    {title:'Double',value:1}
  ]

  warehouse: Depot[] = [];
  driver: Conductor[] = [];
  brand: Brand[] = [];
  line: Lines[] = [];
  state : Condition[] =[];
  resaux: String[];
  entrpt = new FormControl<Depot>(null);
  brands = new FormControl<Brand>(null);
  conductors = new FormControl<Conductor>(null);
  filteredOptions: Observable<Depot[]>;
  filteredbrands: Observable<Brand[]>;
  filteredconductors: Observable<Conductor[]>;
  updateForm :FormGroup;
  isFormSubmitted :boolean;
  showdialg: boolean = true;
constructor(private _carService:CarService,private dialog: MatDialog, private fb:FormBuilder,
  public dialogRef: MatDialogRef<UpdateCarComponent>,@Inject(MAT_DIALOG_DATA) public data:any,
  private snackBar:MatSnackBar,private _warehouseService:EntropotService,private _driverService:ConductorService){

    const car : any = data.car;
    this.updateForm = this.fb.group({

      matricule: new FormControl(car.matricule, Validators.required),
      name: new FormControl(car.name, Validators.required),
      selectedNetwork: [car.selectedNetwork],
      mode:new FormControl(car.mode),
      state: new FormControl(car.state.id, [Validators.required]),
      warehouse: new FormControl(this.entrpt.value, [Validators.required]),
      brand: new FormControl(this.brands.value, [Validators.required]),
      driver: new FormControl(this.conductors.value, [Validators.required]),
      line: new FormControl(car.line.id, [Validators.required]),
      depot : new FormControl(car.warehouse),
      carbrand: new FormControl(car.brand),
      cardriver :  new FormControl(car.driver),
    });
     this._warehouseService.getAllentrp().subscribe(warehouses => {
      this.warehouse = warehouses;
    })
    this._carService.retreivebrands().subscribe(brands => {
      this.brand = brands;
    })
  }

  ngOnInit(): void {
    this.getReseauxNames();
    this.getLineNames();
    this.getconditions();
    this.getconductors();

    this.filteredOptions = this.entrpt.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.warehouse.slice();
      })
    );
    this.entrpt.setValue(this.data.car.warehouse);

    this.filteredbrands = this.brands.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterbr(name as string) : this.brand.slice();
      })
    );
this.brands.setValue(this.data.car.brand);

    this.filteredconductors = this.conductors.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filtercnd(name as string) : this.driver.slice();
      })
    );
    this.conductors.setValue(this.data.car.driver);
  }

  displayFn(entropot: Depot): string {
    return entropot && entropot.name ? entropot.name : '';
  }
  private _filter(name: string): Depot[] {
    const filterValue = name.toLowerCase();

    return this.warehouse.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  displayBr(brnd: Brand): string {
    return brnd && brnd.name ? brnd.name : '';
  }
  private _filterbr(name: string): Brand[] {
    const filterValue = name.toLowerCase();

    return this.brand.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  displaycnd(Cond: Conductor): string {
    return Cond && Cond.name ? `${Cond.name} ${Cond.surname}` : '';
  }
  private _filtercnd(name: string): Conductor[] {
    try {
    const filterValue = name.toLowerCase();
    return this.driver.filter(option => option.name.toLowerCase().includes(filterValue) || option.surname.toLowerCase().includes(filterValue));
    }catch(error){
      console.error('Error in surname');
      return [];
    }
  }


  close(){
    this.dialog.closeAll();
  }
  dismissdialog(){
    this.showdialg =false;
  }
  openToast(message: string): void {
    this.snackBar.openFromComponent(UpdateToastComponent, {
      data: { message: message },
      duration: 3000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: ['snack-green', 'snack-size', 'snack-position']
    })
  }
  openWarningToast(message: string): void {
    this.snackBar.openFromComponent(WarningComponent, {
      data: { message: message }, duration: 5000,
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: ['snack-yellow', 'snack-size']
    });
  }


  openfailToast(message: string): void {
    this.snackBar.openFromComponent(FailedToastComponent, {
      data: { message: message }, duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "bottom",
      panelClass: ['snack-red', 'snack-size']
    });
  }
  getReseauxNames(): void {
    this._warehouseService.retreiveReseaux().subscribe((resx) => {
      this.resaux = resx;
    }, error => {
      this.openfailToast("erreur l\'ors de l\'affichage de liste des réseaux");
      console.log(error);
    })
  }
  getLineNames(): void {
    this._carService.retreivelines().subscribe((line) => {
      this.line = line;
    }, error => {
      this.openfailToast("erreur l\'ors de l\'affichage de liste des lignes");
      console.log(error);
    })
  }
  getconditions(): void {
    this._carService.retreiveConditions().subscribe((state) => {
      this.state = state;
    }, error => {
      this.openfailToast("erreur l\'ors de l\'affichage de liste des conditions");
      console.log(error);
    })
  }


  getconductors():void{
    this._driverService.getallDrivers().subscribe(drivers => {
      this.driver = drivers;
    })
  }

  isFormUnchanged() {

    var carform = this.updateForm.getRawValue();
    const checkvalues = this.data.car;
    
    const entropotValue: Depot = this.entrpt.value;
    const brandValue: Brand = this.brands.value;
    const driverValue: Conductor = this.conductors.value;
    return carform.name === checkvalues.name &&
    carform.matricule === checkvalues.matricule &&
    carform.selectedNetwork === checkvalues.selectedNetwork &&
    entropotValue.id === checkvalues.warehouse.id &&
    brandValue.id === checkvalues.brand.id &&
    driverValue.id === checkvalues.driver.id &&
    carform.path.id === checkvalues.path.id &&
    carform.line.id === checkvalues.line.id &&
    (carform.mode === checkvalues.mode || !carform.mode) &&
    carform.state.id === checkvalues.state.id ;    
  }

  update():void{
    var car = this.updateForm.getRawValue();
    const entropotValue: Depot = this.entrpt.value;
    const brandValue: Brand = this.brands.value;
    const driverValue: Conductor = this.conductors.value;

    const selectedLineId = car.line;
    const selectedLine = this.line.find(line => line.id === selectedLineId);
    car.line = selectedLine;
    const selectedpatheId = car.path;

    const selectedstateId = car.state;
    const selectedstate = this.state.find(state => state.id === selectedstateId);
    car.state = selectedstate;
    
    if (entropotValue.id !== this.data.car.warehouse.id) {
      car.warehouse = entropotValue;
    }
    if (brandValue.id !== this.data.car.brand.id) {
      car.brand = brandValue;
    }
    if (driverValue.id !== this.data.car.driver.id) {
      car.driver = driverValue;
    }


    if (!this.isFormUnchanged()) {
      this._carService.updatecar(this.data.car.id, car).subscribe(() => {
        this.openToast('Le vehicule a été mis à jour')
        this.dialogRef.close();
      }, (error) => {
        const errorMessage = `Erreur lors de la modification du vehicule : ${error.status}`;
       this.openfailToast(errorMessage)
      });
    }
    else {
      this.openWarningToast("nothing changed no update will be submit");
      this.dismissdialog();
    }
  }

  }

