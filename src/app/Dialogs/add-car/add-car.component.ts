import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Observable, map, startWith } from 'rxjs';
import { Conductor } from 'src/app/Core/Models/Conductor';
import { Lines } from 'src/app/Core/Models/Lines';
import { Path } from 'src/app/Core/Models/Path';
import { Brand } from 'src/app/Core/Models/brand';
import { Condition } from 'src/app/Core/Models/condition';
import { Depot } from 'src/app/Core/Models/depot';
import { BrandService } from 'src/app/Core/Services/brand.service';
import { CarService } from 'src/app/Core/Services/car.service';
import { ConductorService } from 'src/app/Core/Services/conductor.service';
import { EntropotService } from 'src/app/Core/Services/entropot.service';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit {

  options= [
    {title :'Standard',value:0},
    {title:'Double',value:1}
  ]
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  addForm: FormGroup;
  isFormSubmitted = false;
  showdialg: boolean = true;
  warehouse: Depot[] = [];
  driver: Conductor[] = [];
  brand: Brand[] = [];
  line: Lines[] = [];
  path: Path[] =[];
  state : Condition[] =[];
  resaux: String[];
  entrpt = new FormControl<Depot>(null);
  brands = new FormControl<Brand>(null);
  conductors = new FormControl<Conductor>(null);
  filteredOptions: Observable<Depot[]>;
  filteredbrands: Observable<Brand[]>;
  filteredconductors: Observable<Conductor[]>;

  constructor(private dialog: MatDialog, private fb: FormBuilder,
    private snackBar: MatSnackBar, private _warehouseService: EntropotService,
     private _carService: CarService,
    private _driverService:ConductorService) {

    this.addForm = this.fb.group({

      matricule: new FormControl('', Validators.required),
      selectedNetwork: [''],
      mode:new FormControl(''),
      state: new FormControl('', [Validators.required]),
      warehouse: new FormControl(this.entrpt, [Validators.required]),
      brand: new FormControl(this.brands, [Validators.required]),
      driver: new FormControl(this.conductors, [Validators.required]),
      line: new FormControl('', [Validators.required]),
      path: new FormControl('', [Validators.required]),
      
    })

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
    this.getpaths();

    this.filteredOptions = this.entrpt.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.warehouse.slice();
      })
    );

    this.filteredbrands = this.brands.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterbr(name as string) : this.brand.slice();
      })
    );

    this.filteredconductors = this.conductors.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filtercnd(name as string) : this.driver.slice();
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
    const filterValue = name.toLowerCase();
    return this.driver.filter(option => option.name.toLowerCase().includes(filterValue) );
    }


  close() {
    this.dialog.closeAll()
  }
  dismissdialog() {
    this.showdialg = false;
  }
  add() {
    this.isFormSubmitted = true;
    const formvalue = this.addForm.value;

    if (this.addForm.invalid) {
      
      console.log(formvalue);
      this.openWarningToast("Form invalide ou incomplet!");
    } else {
      //liste deroulante
      const selectedLineId = formvalue.line;
      const selectedpathId = formvalue.path;
      const selectedstateId = formvalue.state;
    const selectedLine = this.line.find(line => line.id === selectedLineId);  
      formvalue.line = selectedLine;
      const selectedpath =this.path.find(path => path.id === selectedpathId);
      formvalue.path = selectedpath;
      const selectedstate =this.state.find(state => state.id === selectedstateId);
      formvalue.state = selectedstate;

      // mat-autocomplete
      const selectedMaker :Depot = this.entrpt.value;
      const selectedbrand :Brand = this.brands.value;
      const selectedconductor :Conductor = this.conductors.value;

      formvalue.warehouse = selectedMaker;
      formvalue.brand = selectedbrand;
      formvalue.driver = selectedconductor;

      this._carService.addcar(formvalue).subscribe(
        () => {
        
          console.log(formvalue);
          this.openAddToast('Vehicule ajouté avec succès');
        },
        (error) => {
          const errormessage = `Erreur lors de l'ajout d'un traget : ${error.status}`;
          console.log(formvalue);
          this.openfailToast(errormessage);
        }
      );
    }
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
  openWarningToast(message: string): void {
    this.snackBar.openFromComponent(WarningToastComponent, {
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
      verticalPosition: this.verticalPosition,
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

  getpaths(): void {
    this._carService.retreivePaths().subscribe((path) => {
      this.path = path;
    })
  }
  getconductors():void{
    this._driverService.getallDrivers().subscribe(drivers => {
      this.driver = drivers;
    })
  }
}
