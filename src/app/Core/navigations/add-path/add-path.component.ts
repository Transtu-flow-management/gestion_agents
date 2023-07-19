import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Path } from '../../interfaces/Path';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PathService } from '../../Services/path.service';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import * as L from 'leaflet';
import { Lines } from '../../interfaces/Lines';
import 'leaflet-routing-machine';
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import { WarningComponent } from 'src/app/alerts/warning/warning.component';

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
export class AddPathComponent implements AfterViewInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  lines: Lines[] = [];
  showdialg: boolean = true;
  map: L.Map;
  smallIcon: L.Icon;
  redicon: L.Icon;
  marker: L.Marker;
  public latt: number;
  public long: number;
  public data:string;
  addForm: FormGroup;
  isFormSubmitted = false;
  constructor(private elementRef: ElementRef, private http: HttpClient,
     private fb: FormBuilder, private _pathsertvice: PathService,
      private snackBar: MatSnackBar) {
    this.addForm = this.fb.group({
      startFr: new FormControl('', [Validators.required, Validators.minLength(4)]),
      startAr: new FormControl('', [Validators.required, Validators.minLength(4)]),
      endFr: new FormControl('', [Validators.required, Validators.minLength(4)]),
      endAr: new FormControl('', [Validators.required, Validators.minLength(4)]),
      type: new FormControl('', [Validators.required, allowedValues]),
      data:new FormControl('', [Validators.required]),
      line:new FormControl('', [Validators.required]),
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


  addpath(): void {
    this.isFormSubmitted = true;
  
    const formvalue = this.addForm.value;
    
    
    if (this.addForm.invalid) {
      
      console.log(formvalue);
      this.openWarningToast("Form invalide ou incomplet!");
    } else {
      const selectedLineId = formvalue.line;
    const selectedLine = this.lines.find(line => line.id === selectedLineId);  
      formvalue.line = selectedLine;
      this._pathsertvice.addpath(formvalue).subscribe(
        () => {
        
          console.log(formvalue);
          this.openAddToast('Traget ajouté avec succès');
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
      verticalPosition: this.verticalPosition,
      panelClass: ['snack-red', 'snack-size']
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
      zoom: zoomLevel,
      minZoom:8,

    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
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
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
  getAddressFromCoordinates(lat: number, lng: number): Promise<{ lat: number, lng: number }> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  
    return this.http.get(url)
      .toPromise()
      .then((response: any) => {
        if (response?.address) {
          const { lat, lon } = response;
          return { lat, lng: lon };
        }
        throw new Error('Address not found');
      })
      .catch(() => {
        throw new Error('Address not found');
      });
  }

  enableClickToAddMarker(): void {
    let startMarker: L.Marker;
    let endMarker: L.Marker;
    let routingPlan: L.Routing.Plan;
    let routingControl: L.Routing.Control;
    let savedData: L.LayerGroup = L.layerGroup(); 
    let loadedData: L.LayerGroup = L.layerGroup(); 
    let geoJSONLayer: L.GeoJSON;
    const clearMarkersAndRouting = (): void => {

      if (routingControl) {
        this.map.removeControl(routingControl);
        routingControl = null;
      }

      if (routingPlan) {
        routingPlan.removeFrom(this.map);
        routingPlan = null;
      }

      if (startMarker) {
        savedData.removeLayer(startMarker);
        this.map.removeLayer(startMarker);
        startMarker = null;
      }

      if (endMarker) {
        savedData.removeLayer(endMarker);
        this.map.removeLayer(endMarker);
        endMarker = null;
      }
      if (geoJSONLayer) {
        loadedData.removeLayer(geoJSONLayer);
        this.map.removeLayer(geoJSONLayer);
        geoJSONLayer = null;
      }
   
    };
    this.addForm.get('startFr').valueChanges.subscribe(()=>{
      updateRouting();
    });
    this.addForm.get('startAr').valueChanges.subscribe(()=>{
      updateRouting();
    });
    this.addForm.get('endFr').valueChanges.subscribe(()=>{
      updateRouting();
    });
    this.addForm.get('endAr').valueChanges.subscribe(()=>{
      updateRouting();
    });
    const updateRouting = (): void => {
        if (startMarker && endMarker) {
          const popupTextS = `Location FR: ${this.addForm.get('startFr').value} <br> Location AR:${this.addForm.get('startAr').value}`;
          const popupTextE = `Location FR: ${this.addForm.get('endFr').value} <br> Location AR:${this.addForm.get('endAr').value}`;
         

        routingPlan = new L.Routing.Plan([startMarker.getLatLng(), endMarker.getLatLng()], {

          createMarker: (i, waypoints, n) => {
            if (i === 0) {
             startMarker = L.marker(waypoints.latLng, { icon: this.smallIcon, draggable: true }).bindPopup(popupTextS).openPopup() 
          
            savedData.addLayer(startMarker)
            return startMarker;
              
            } else if (i === n - 1) {
               endMarker= L.marker(waypoints.latLng, { icon: this.redicon, draggable: true }).bindPopup(popupTextE).openPopup()  
            
              savedData.addLayer(endMarker);
              return endMarker;
            }
            return null;
          },
        });
        routingPlan.addTo(this.map);

        routingControl = L.Routing.control({
          plan: routingPlan,
          lineOptions: {
            styles: [{ color: 'blue', opacity: 0.6, weight: 9 },
            { color: 'white', opacity: 0.6, weight: 6 },
            ],
            extendToWaypoints: false,
            missingRouteTolerance: 0,
          },
          
        });
        routingControl.addTo(this.map);
      }
      
    };
 
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;

      if (!startMarker) {
        startMarker = L.marker([lat, lng], { icon: this.smallIcon, draggable: true })    
      } else if (!endMarker) {
        endMarker = L.marker([lat, lng], { icon: this.redicon, draggable: true })
      
       
      } else {
        return null;
      }

      updateRouting();
      let geoJSON = savedData.toGeoJSON();
      let data = JSON.stringify(geoJSON);
      this.addForm.get('data').setValue(data);
    });  

    this.map.on('contextmenu', () => {
      clearMarkersAndRouting();
      
    });

    const saveButton = L.Control.extend({
      options: {
        position: 'topleft',
      },
  
      onAdd: (map: L.Map) => {
        const button = L.DomUtil.create('button', 'save-button');
        button.innerHTML = 'Save';
       
        button.addEventListener('click', () => {
          const geoJSON = savedData.toGeoJSON(); // Convert layer group to GeoJSON
          const data = JSON.stringify(geoJSON);
          // You can now use the 'data' variable to save the GeoJSON data as desired
          console.log(data);
        });
  
        return button;
      },
    });
    
   
    this.map.addControl(new saveButton());
    const geojson = '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[10.183166,36.856274]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[10.168749,36.831821]}}]}';
  
    const loadbutton = L.Control.extend({
      options:{
        position :'topleft',
      },
      onAdd:(map :L.Map) =>{
        const buttonl = L.DomUtil.create('button', 'load-button');
        buttonl.innerHTML = 'Load';        
        buttonl.addEventListener('click',()=>{
           geoJSONLayer = L.geoJSON(JSON.parse(geojson)).addTo(map);
          map.fitBounds(geoJSONLayer.getBounds());
        });
      
return buttonl;
      }
    });
    this.map.addControl(new loadbutton);   

    
  }

  getLineNames(): void {
    this._pathsertvice.retreivelines().subscribe((line) => {
      this.lines = line;
    }, error => {
      this.openfailToast("erreur l\'ors de l\'affichage de liste des lignes");
      console.log(error);
    })
  }
}