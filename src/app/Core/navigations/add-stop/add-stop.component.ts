import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef,AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { Path } from '../../Models/Path';
import { PathService } from '../../Services/path.service';
import { StopserviceService } from '../../Services/stopservice.service';
import { error } from 'jquery';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
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
  addForm: FormGroup;
  firstFormGroup:FormGroup;
  isFormSubmitted:boolean;
  paths : Path[] = [];
  map: L.Map;
  marker: L.Marker;
   startMarkerdraw :L.Marker;
   endMarkerdraw:L.Marker;
  routingControl: L.Routing.Control;
  routingPlan: L.Routing.Plan;
  private geoJsonLayer: L.GeoJSON;
  smallIcon: L.Icon;
  public latt: number;
  public long: number;
  constructor(private elementRef: ElementRef,private fb: FormBuilder,private http:HttpClient,
    private _stopService:StopserviceService,private snackBar:MatSnackBar){
  this.firstFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required],
  });
  this.addForm = this.fb.group({
    name_fr: new FormControl('', [Validators.required, Validators.minLength(2)]),
    name_ar: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description:new FormControl(''),
    lat: new FormControl(null, [Validators.required]),
    lng:  new FormControl(null, [Validators.required]),
    stopnumber:new FormControl(null, [Validators.required]),
  })
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
    iconUrl: '/assets/images/blue/bus.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
   
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
}

enableClickToAddMarker(): void {
  this.map.on('click', (event: L.LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;
    const popupText = `Location:${event.latlng}`;
    this.latt = lat;
    this.long = lng;

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([lat, lng], { icon: this.smallIcon,draggable: true })
      .addTo(this.map)
      .bindPopup(popupText)
      .openPopup();    
     this.addForm.patchValue({
      lat: this.long,
        lng: this.latt
      });
      console.log(this.addForm.value)
   
  });
  this.map.on('contextmenu', () => {
       this.map.removeLayer(this.marker);
       this.removeGeoJSONLayer();
  });
  }
  openfailToast(message: string): void {
    this.snackBar.openFromComponent(FailedToastComponent, {
      data: { message: message }, duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "bottom" ,
      panelClass: ['snack-red', 'snack-size']
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
      // Load and display GeoJSON layer
      this.loadAndDisplayGeoJSON(path.data);
    } else {
      // Remove GeoJSON layer
      this.removeGeoJSONLayer();
    }
  }
  loadAndDisplayGeoJSON(geoJsonString: string): void {
   
    this.removeGeoJSONLayer(); // Remove any existing GeoJSON layer
   
    try {
      const geojsonData = JSON.parse(geoJsonString);
      for (const feature of geojsonData.features) {
        if (feature.geometry.type === 'LineString') {
         
          const coordinates = feature.geometry.coordinates;
          const firstC = coordinates[0];
          const lastC = coordinates[coordinates.length - 1];
          this.startMarkerdraw = L.marker([firstC[1], firstC[0]]).setIcon(this.smallIcon).addTo(this.map);
          this.endMarkerdraw = L.marker([lastC[1], lastC[0]]).setIcon(this.smallIcon).addTo(this.map);
        }
      }
      const features = geojsonData.features;
      if (features[0].geometry.type === 'Point') {       
        const startCoordinates = features[0].geometry.coordinates;
        const endCoordinates = features[features.length - 1].geometry.coordinates;
       const startMarker = L.marker([startCoordinates[1], startCoordinates[0]]);
       const endMarker = L.marker([endCoordinates[1], endCoordinates[0]]);
        this.updateRouting(startMarker,endMarker);
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
        //router:(L.Routing as any).mapbox('pk.eyJ1Ijoib3VzczAxYW1hIiwiYSI6ImNsa2FheW41MzA1Z3ozZG13dGpiZjl4d2YifQ.zBUhApqgliMB7y1zR3ODWw'),
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

}
