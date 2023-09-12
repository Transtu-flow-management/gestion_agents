import { AfterViewInit, Component, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { AbstractControl,ValidatorFn, FormBuilder, FormControl, FormGroup,ValidationErrors,Validators } from '@angular/forms';
import { EntropotService } from 'src/app/Core/Services/entropot.service';
import { Depot } from 'src/app/Core/Models/depot';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { UpdateToastComponent } from 'src/app/alerts/update-toast/update-toast.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';
@Component({
  selector: 'app-add-depo',
  templateUrl: './add-depo.component.html',
  styleUrls: ['./add-depo.component.css']
})
export class AddDepoComponent implements AfterViewInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  depot : Depot;
  resaux : String[];
  showdialg: boolean = true;
  map: L.Map;
  smallIcon: L.Icon;
  marker: L.Marker;
  public latt: number;
  public long: number;
  public adresse: string;
  addForm: FormGroup;
  isFormSubmitted = false;
  constructor(private dialog :MatDialogRef<AddDepoComponent>,private elementRef: ElementRef, private http: HttpClient, 
    private fb:FormBuilder,private _entrpserv :EntropotService,
    private snackBar: MatSnackBar) {
    this.addForm= this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(6)]),

      longitude: new FormControl(null, [Validators.required]),
      lattitude:  new FormControl(null, [Validators.required]),
      capacite: new FormControl(null, [Validators.required, this.capaciteValidator,Validators.pattern('^[0-9]*$')]),
      adresse: new FormControl('', [Validators.required, Validators.minLength(6)]),
      selectedReseau :[''], 
    })
  }
  capaciteValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value > 999)) {
      return { maxLength: true };
    }
    return null;
  }
 
  ngAfterViewInit(): void {
    this.createMap();
    this.initializeMarkerIcon();
    this.getReseauxNames();
    this.enableClickToAddMarker();
    this.dismissdialog();
  }

  addEntropot():void{
    this.isFormSubmitted =true;

    if (this.addForm.invalid){
     
      return this.openWarningToast('Form invalide');
    }
    const formvalue = this.addForm.value;
  this._entrpserv.createEntroopot(formvalue).subscribe(()=>{
    this.openAddToast('Entropot ajoué avec success')
    this.dialog.close(formvalue);
  },(error)=>{
    const errormessage =`Erreur lors de l'ajout d'un agent : ${error.status}`
    this.openfailToast(errormessage)
  })
  }
  close()
  {
     this.dialog.close()
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
 openWarningToast(message:string):void{
  this.snackBar.openFromComponent(WarningToastComponent,{
    data: {message:message},duration: 5000,
  horizontalPosition: "center",
     verticalPosition: "top",
     panelClass : ['snack-yellow','snack-size']
});
 }


 openfailToast(message:string):void{
this.snackBar.openFromComponent(FailedToastComponent,{
  data: {message:message},duration: 5000,
  horizontalPosition: "end",
     verticalPosition: this.verticalPosition,
     panelClass : ['snack-red','snack-size']
});
 }
  createMap(): void {
    const centralLocation = {
      lat: 36.8392,
      lng: 10.1577
    };

    const zoomLevel = 12;

    this.map = L.map(this.elementRef.nativeElement.querySelector('#map'), {
      center: [centralLocation.lat, centralLocation.lng],
      zoom: zoomLevel
    });

    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 8,
      maxZoom: 17,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    mainLayer.addTo(this.map);
  }

  initializeMarkerIcon(): void {
    this.smallIcon = new L.Icon({
      iconUrl: 'src/ass',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
  }

  enableClickToAddMarker(): void {
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      const popupText = `Location: ${this.adresse}`;
      this.latt = lat;
      this.long = lng;

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      this.marker = L.marker([lat, lng], { icon: this.smallIcon })
        .addTo(this.map)
        .bindPopup(popupText)
        .openPopup();

      this.getAddressFromCoordinates(lat, lng,450).then((address: string) => {
        console.log('Address:', address,' avec long =',this.long," et latt =",this.latt);
        this.adresse=address;
       this.addForm.patchValue({
          adresse: address,
          longitude: this.long,
          lattitude: this.latt
        });
      });
    });
  }

  getAddressFromCoordinates(lat: number, lng: number,radius: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&radius=${radius}`;

    return this.http.get(url)
      .toPromise()
      .then((response: any) => {
        if (response?.address) {
          const { road, city, country,lat,lng } = response.address;
          return `${road}, ${city}, ${country}`;
        }
        return 'Adresse non trouvé';
      })
      .catch(() => 'Adresse non trouvé');
  }
  getReseauxNames():void{
this._entrpserv.retreiveReseaux().subscribe((resx)=>{
  this.resaux = resx;
},error =>{
  this.openfailToast("erreur l\'ors de l\'affichage de liste des réseaux");
  console.log(error);
})
  }
}
