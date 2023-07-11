import { Component,ElementRef,AfterViewInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Path } from '../../interfaces/Path';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { PathService } from '../../Services/path.service';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import * as L from 'leaflet';
import { Lines } from '../../interfaces/Lines';
import 'leaflet-routing-machine';
function allowedValues(control: FormControl) {
  const value = control.value;

  if (value !== 0 && value !== 1) {
    return { invalidValue: true };
  }

  return null;
}
@Component({
  selector: 'app-add-path',
  templateUrl: './add-path.component.html',
  styleUrls: ['./add-path.component.css']
  
})
export class AddPathComponent implements AfterViewInit{

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  path : Path;
  lines : Lines[];
  showdialg: boolean = true;
  map: L.Map;
  smallIcon: L.Icon;
  redicon: L.Icon;
  marker: L.Marker;
  public latt: number;
  public long: number;
  public adresse: string;
  type:number;
  addForm: FormGroup;
  isFormSubmitted = false;
  constructor(private elementRef: ElementRef, private http: HttpClient, private fb:FormBuilder,private _pathsertvice:PathService,private snackBar: MatSnackBar) {
    this.addForm= this.fb.group({
      nameFr: new FormControl('', [Validators.required,Validators.minLength(4)]),
      nameAr: new FormControl('', [Validators.required,Validators.minLength(4)]),
      type : new FormControl('', [Validators.required,allowedValues]),
      longitude: new FormControl(null, [Validators.required]),
      lattitude:  new FormControl(null, [Validators.required]),
      selectedLine :[''], 
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
    this.getLineNames();
    this.enableClickToAddMarker();

  }


  addpath():void{
    this.isFormSubmitted =true;

    if (this.addForm.invalid){
     
      return this.openWarningToast('Form invalide');
    }
    const formvalue = this.addForm.value;
  this._pathsertvice.addpath(formvalue).subscribe(()=>{
    this.openAddToast('traget ajoué avec success')
   
  },(error)=>{
    const errormessage =`Erreur lors de l'ajout d'un traget : ${error.status}`
    this.openfailToast(errormessage)
  })
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
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      shadowSize: [41, 41],
  
    });
    this.redicon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      shadowSize: [41, 41],
  
    });
  
  }

  enableClickToAddMarker(): void {
    let startMarker: L.Marker;
    let endMarker: L.Marker;
    let routingControl: L.Routing.Control;
  
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
  
      if (!startMarker) {
        
        startMarker = L.marker([lat, lng], { icon: this.smallIcon })
          .addTo(this.map);
      } else if (!endMarker) {
        endMarker = L.marker([lat, lng], { icon: this.redicon })
          .addTo(this.map);
  
        routingControl = L.Routing.control({
          waypoints: [
            L.latLng(startMarker.getLatLng()),
            L.latLng(endMarker.getLatLng())
          ],
         
          lineOptions: {
            styles: [{ color: 'blue' }],
            extendToWaypoints: false,
            missingRouteTolerance: 0
          }
        }).addTo(this.map);
      } else {

        this.map.removeLayer(startMarker);
        this.map.removeLayer(endMarker);
        this.map.removeControl(routingControl);
        startMarker = null;
        endMarker = null;
        routingControl = null;
      }
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
  getLineNames():void{
this._pathsertvice.retreivelines().subscribe((line)=>{
  this.lines = line;
},error =>{
  this.openfailToast("erreur l\'ors de l\'affichage de liste des lignes");
  console.log(error);
})
  }

}

