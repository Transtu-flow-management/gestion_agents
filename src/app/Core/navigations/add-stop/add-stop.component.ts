import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef,AfterViewInit, ComponentFactoryResolver, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { Path } from '../../Models/Path';
import { PathService } from '../../Services/path.service';
import { StopserviceService } from '../../Services/stopservice.service';
import { error } from 'jquery';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { WarningComponent } from 'src/app/alerts/warning/warning.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { Stop } from '../../Models/Stop';
import { AddCarComponent } from 'src/app/Dialogs/add-car/add-car.component';
import { UpdatepopupComponent } from '../updatepopup/updatepopup.component';
import { id } from 'date-fns/locale';
import { Router } from '@angular/router';
import { SelectedStopService } from '../../Services/selected-stop.service';
import { UpdateToastComponent } from 'src/app/alerts/update-toast/update-toast.component';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'app-add-stop',
  templateUrl: './add-stop.component.html',
  styleUrls: ['./add-stop.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class AddStopComponent implements AfterViewInit{
  @ViewChild('stepper') stepper!: MatStepper;
  addForm: FormGroup;
  UpdateForm: FormGroup;
  firstFormGroup:FormGroup;
  isFormSubmitted:boolean;
  paths : Path[] = [];
  stops: Stop[] = [];
  updateStop : Stop;

  map: L.Map;
  public message : string;
  marker: L.Marker;
   startMarkerdraw :L.Marker;
   endMarkerdraw:L.Marker;
   stopMarker: L.Marker;
  routingControl: L.Routing.Control;
  routingPlan: L.Routing.Plan;
  private geoJsonLayer: L.GeoJSON;
  starticon: L.Icon;
  endicon: L.Icon;
  smallIcon:  L.Icon;
  stopIcon : L.Icon;
  public latt: number;
  public long: number;
  StartA : string;
  StartB : string;
  currentPage = 0;
  pageSize = 2;
  private subscription: Subscription;


  constructor(private elementRef: ElementRef,private fb: FormBuilder,private http:HttpClient,private componentFactoryResolver: ComponentFactoryResolver
    ,private injector : Injector,private route : Router,private sharedservice : SelectedStopService,
    private _stopService:StopserviceService,private snackBar:MatSnackBar){
  this.firstFormGroup = this.fb.group({
    firstCtrl: new FormControl('',Validators.required),
  });
  this.addForm = this.fb.group({
    name_fr: new FormControl('', [Validators.required, Validators.minLength(2)]),
    name_ar: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description:new FormControl(''),
    lat: new FormControl(null, [Validators.required]),
    lng:  new FormControl(null, [Validators.required]),
    stopnumber:new FormControl(null, [Validators.required]),
    path: ['']
  });
  this.subscription = this.sharedservice.selectedStop$.subscribe(stop => {
    if (stop) {
      this.addForm.patchValue(stop);
      this.updateStop = stop;
      console.log(this.updateStop);
    }
  });


}

ngAfterViewInit(): void {
  this.createMap();
  this.initializeMarkerIcon();
  this.enableClickToAddMarker();
  this.fetchAllPaths();  
}


createMap(): void {
  const centralLocation = {
    lat: 36.8392,
    lng: 10.1577
  };

  const zoomLevel = 12;

  this.map = L.map(this.elementRef.nativeElement.querySelector('#map'), {
    center: [centralLocation.lat, centralLocation.lng],
    zoom: zoomLevel,
    minZoom:8,

  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   
    
  }).addTo(this.map);

  var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
   
    maxZoom: 14,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });
  var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    
    maxZoom: 14,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });

  var mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    
    maxZoom: 14,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Oussama Omrani'
  });

  mainLayer.addTo(this.map);
  var baseMaps = {
    "OSM": mainLayer,

    "Google Satellite": googleSat,
    "Google Streets": googleStreets,
  };
  L.control.layers(baseMaps).addTo(this.map);
}

initializeMarkerIcon(): void {
  this.smallIcon = new L.Icon({
    iconUrl: '/assets/images/blue/busstop.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
   
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
  this.starticon = new L.Icon({
    iconUrl: '/assets/images/green/bus.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
   
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
  this.endicon = new L.Icon({
    iconUrl: '/assets/images/red/bus.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
   
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
  this.stopIcon = new L.Icon({
    iconUrl: '/assets/images/red/stop.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
   
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

}

private createCustomPopup(stop :Stop) {
  const factory = this.componentFactoryResolver.resolveComponentFactory(UpdatepopupComponent);
  const component = factory.create(this.injector);
  component.changeDetectorRef.detectChanges();
  const wrapperDiv = document.createElement('div');
  wrapperDiv.appendChild(component.location.nativeElement);
  const updateButton = document.createElement('button');
  updateButton.textContent = 'update';
  updateButton.addEventListener('click',()=>{
   component.instance.selected = stop;
    component.instance.updateStop();
  });

  wrapperDiv.appendChild(updateButton);

  const delbutn = document.createElement('button');
  delbutn.textContent = 'delete';
  delbutn.addEventListener('click',()=>{
    component.instance.deleteStop(stop.id);
  });

  wrapperDiv.appendChild(delbutn);

  return wrapperDiv;
}

enableClickToAddMarker(): void {
  this.map.on('click', (event: L.LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;
    
    this.latt = lat;
    this.long = lng;

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([lat, lng], { icon: this.smallIcon,draggable: true })
      .on('dragend', (dragEvent: L.LeafletEvent) => {
        const newLatLng = dragEvent.target.getLatLng();
        this.latt = newLatLng.lat;
        this.long = newLatLng.lng;
        
        // Update form values
        this.addForm.patchValue({
          lat: this.latt,
          lng: this.long
        });
        const popupText = `Location:${this.latt},${this.long}`;
        this.marker.openPopup().bindPopup(popupText);
      }).addTo(this.map);
  });
  
  this.map.on('contextmenu', () => {
       this.map.removeLayer(this.marker);
       //this.removeGeoJSONLayer();
  });
  }



  fetchAllPaths(): void {
    this._stopService.getallpaths().subscribe(
      paths => {
        this.paths = paths;
      },
      error => {
        this.openfailToast("Erreur lors de l'affichage de la liste des trajets");
      }
    );
  }
  
  onCheckboxChange(path: Path, isChecked: boolean): void {
    if (isChecked) {
      for (var p of this.paths){
        if (p === path){
          console.log(p.stops);
         this.StartA = p.startFr;
         this.StartB = p.endFr;
         this.showStopMarkers(p.stops);
        }
      }
      this.addForm.get('path').setValue(path);
      this.loadAndDisplayGeoJSON(path.data);
      console.log(path);
    } else {
      this.removeGeoJSONLayer();
    }
  }


  stopMarkers: L.Marker[] = []; 
  showStopMarkers(stops: Stop[]): void {
    this.clearMarkers();
      for (const stop of stops) {
        if (stop!=null){
       this.stopMarker = L.marker([stop.lat, stop.lng],{icon:this.stopIcon,draggable:true}).bindPopup(()=>this.createCustomPopup(stop)).openPopup().addTo(this.map);
       this.stopMarker.on('dragend', (dragEvent: L.LeafletEvent) => {
        const newLatLng = dragEvent.target.getLatLng();
        this.addForm.get('lat').setValue(newLatLng.lat);
        this.addForm.get('lng').setValue(newLatLng.lng);
        console.log(this.addForm.value)
      })
       this.stopMarkers.push(this.stopMarker);
      }    
    }
  }
  private clearMarkers(): void {
    for (const marker of this.stopMarkers) {
      marker.removeFrom(this.map);
    }
    this.stopMarkers = [];
  }

  loadAndDisplayGeoJSON(geoJsonString: string): void {
   
    this.removeGeoJSONLayer();
   
    try {     
      
      
      const geojsonData = JSON.parse(geoJsonString);
      for (const feature of geojsonData.features) {
        if (feature.geometry.type === 'LineString') {
         
          const coordinates = feature.geometry.coordinates;
          const firstC = coordinates[0];
          const lastC = coordinates[coordinates.length - 1];
          this.startMarkerdraw = L.marker([firstC[1], firstC[0]]).setIcon(this.starticon).openPopup().bindPopup(this.StartA).addTo(this.map);
          this.endMarkerdraw = L.marker([lastC[1], lastC[0]]).setIcon(this.endicon).openPopup().bindPopup(this.StartB).addTo(this.map);
        }
      }
      const features = geojsonData.features;
      if (features[0].geometry.type === 'Point') {       
        const startCoordinates = features[0].geometry.coordinates;
        const endCoordinates = features[features.length - 1].geometry.coordinates;
        this.startMarkerdraw = L.marker([startCoordinates[1], startCoordinates[0]],{icon: this.starticon}).openPopup().bindPopup(this.StartA).addTo(this.map);
        this.endMarkerdraw = L.marker([endCoordinates[1], endCoordinates[0]],{icon: this.endicon}).openPopup().bindPopup(this.StartB).addTo(this.map);
        this.updateRouting(this.startMarkerdraw,this.endMarkerdraw);
      }

      
      this.geoJsonLayer = L.geoJSON(geojsonData).addTo(this.map);
    } catch (error) {
      console.error('Error parsing or loading GeoJSON:', error);
    }
    
  }
   updateRouting (start : L.Marker,end : L.Marker): void {
     
      this.initialiszeroute();
      this.routingPlan = new L.Routing.Plan([start.getLatLng(), end.getLatLng()]);

      this.routingPlan.addTo(this.map);

      this.routingControl = L.Routing.control({

        plan: this.routingPlan,
        lineOptions: {
          styles: [{ color: 'blue', opacity: 0.6, weight: 9 },
          { color: 'white', opacity: 0.6, weight: 6 },
          ],
          extendToWaypoints: false,
          missingRouteTolerance: 0,
        },
        addWaypoints: false,        
      });
      this.routingControl.addTo(this.map);
    }
  

   initialiszeroute(): void{
    if (this.routingControl) {
      this.removeRoutingControl();
    }

    if (this.routingPlan) {
      this.routingPlan.removeFrom(this.map);
      this.routingPlan = null;
 
    }
  }



  
  removeRoutingControl(): void {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
    }
  }
  
    removeGeoJSONLayer(): void {
    
      if (this.routingControl && this.routingPlan){
      this.initialiszeroute();}

      if (this.marker){
        this.map.removeLayer(this.marker);
        this.marker = null;
      }
      if(this.startMarkerdraw){
        this.map.removeLayer(this.startMarkerdraw);
        this.startMarkerdraw = null;
      }
      if (this.endMarkerdraw){
        this.map.removeLayer(this.endMarkerdraw);
        this.endMarkerdraw = null;
      }
      if (this.geoJsonLayer) {
        this.map.removeLayer(this.geoJsonLayer);
        this.geoJsonLayer = null;
      }
      
    }

    removestopMarkers():void{
      if (this.stopMarker){
        this.map.removeLayer(this.stopMarker);
        this.stopMarkers = [];

      }

    }

    openfailToast(message: string): void {
      this.snackBar.openFromComponent(FailedToastComponent, {
        data: { message: message }, duration: 5000,
        horizontalPosition: "end",
        verticalPosition: "bottom" ,
        panelClass: ['snack-red', 'snack-size']
      });
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
      this.snackBar.openFromComponent(WarningComponent, {
        data: { message: message }, duration: 5000,
        horizontalPosition: "center",
        verticalPosition: "top",
        panelClass: ['snack-yellow', 'snack-size']
      });
    }
    openUpdateToast(message: string) {
      this.snackBar.openFromComponent(UpdateToastComponent, {
        data: { message: message },
        duration: 5000,
        horizontalPosition: "end",
        verticalPosition: "top",
        panelClass: ['snack-green', 'snack-size', 'snack-position']
      })
    }

    addStop():void{
      const formValue = this.addForm.value;
      
      this.UpdateForm = this.fb.group({
        name_fr: new FormControl( this.addForm.get('name_fr').value, [Validators.required, Validators.minLength(2)]),
        name_ar: new FormControl(this.addForm.get('name_ar').value, [Validators.required, Validators.minLength(2)]),
        description:new FormControl(this.addForm.get('description').value),
        lat: new FormControl(this.addForm.get('lat').value, [Validators.required]),
        lng:  new FormControl(this.addForm.get('lng').value, [Validators.required]),
        stopnumber:new FormControl(this.addForm.get('stopnumber').value, [Validators.required]),
        path: [this.addForm.get('path').value]
      });
      const stopData: Stop = this.UpdateForm.value;
      if (this.addForm.valid ){
        if (this.updateStop != null){
          const id = this.updateStop.id;
          console.log("updated : ",id)
          if (id){
          this._stopService.updatepstop(stopData,id).subscribe(()=>{
              this.openUpdateToast("Arrêt mis à jour avec success");
              this.message = "Arrêt mis à jour avec success";
            },error =>{
              const message = `Erreur l\'ors de mise à jour de nouvelle arrêt ${error.status}`;
              this.openfailToast(message);
            })
          }
          }else{
      this._stopService.addstop(formValue).subscribe(()=>{
        console.log("add : ",formValue)
        this.openAddToast("Arret ajouté avec succéss");
        this.message = "Arret ajouté avec succéss";
      },error =>{
        const message = `Erreur l\'ors de l\'ajout de nouvelle arrêt ${error.status}`;
        this.openfailToast(message);
      })
       }
      }else{
        this.openWarningToast("La Forme est invalide ou incomplet");       
    }
  }
  reset (){
    this.stepper.reset();
    this.fetchAllPaths();
  }

}
