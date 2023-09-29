import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, AfterViewInit, Injector, ComponentFactoryResolver } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { Path } from '../../Models/Path';
import { Subscription } from 'rxjs';
import { StopserviceService } from '../../Services/stopservice.service';
import { error } from 'jquery';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { StopPopupComponent } from '../stop-popup/stop-popup.component';
import { Stop } from '../../Models/Stop';
import { WarningComponent } from 'src/app/alerts/warning/warning.component';
import { SelectedStopService } from '../../Services/selected-stop.service';
@Component({
  selector: 'app-add-stop',
  templateUrl: './add-stop.component.html',
  styleUrls: ['./add-stop.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class AddStopComponent implements AfterViewInit {

  stopTypes: { name: string, value: number }[] = [
    { name: 'Station', value: 1 },
    { name: 'Small Stop', value: 2 },
    { name: 'Stop', value: 3 },
    { name: 'No Stop', value: 4 }
  ];

  addForm: FormGroup;
  UpdateForm: FormGroup;
  updateStop: Stop;
  stops: Stop[] = [];
  firstFormGroup: FormGroup;
  isFormSubmitted: boolean;
  public message: string;
  paths: Path[] = [];
  map: L.Map;
  stopMarkers: L.Marker[] = [];
  marker: L.Marker;
  startMarkerdraw: L.Marker;
  endMarkerdraw: L.Marker;
  routingControl: L.Routing.Control;
  routingPlan: L.Routing.Plan;
  private geoJsonLayer: L.GeoJSON;
  smallIcon: L.Icon;
  stopIcon: L.Icon;
  public latt: number;
  public long: number;
  StartA: string;
  StartB: string;
  private subscription: Subscription;
  constructor(private elementRef: ElementRef, private fb: FormBuilder, private http: HttpClient,
    private _stopService: StopserviceService, private sharedDataService: SelectedStopService, private snackBar: MatSnackBar, private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector,) {
    this.firstFormGroup = this.fb.group({
      firstCtrl: ['', Validators.required],
    });
    this.addForm = this.fb.group({
      name_fr: new FormControl('', [Validators.required, Validators.minLength(2)]),
      name_ar: new FormControl('', [Validators.required, Validators.minLength(2)]),
      description: new FormControl(''),
      lat: new FormControl(null, [Validators.required]),
      lng: new FormControl(null, [Validators.required]),
      stopnumber: new FormControl(null, [Validators.required]),
      stopType: new FormControl(null, [Validators.required]),
      selectedStop: [''],
      path: ['']
    });

    this.subscription = this.sharedDataService.selectedStop$.subscribe(stop => {
      if (stop) {
        this.addForm.patchValue(stop); // Populate form fields with selected stop data
      }
    });
  }

  ngAfterViewInit(): void {
    this.createMap();
    this.initializeMarkerIcon();
    this.enableClickToAddMarker();
    this.fetchAllPaths();
    this.fetchstops();
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
      minZoom: 8,

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
    this.stopIcon = new L.Icon({
      iconUrl: '/assets/images/red/busstop.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',

      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
  }

  enableClickToAddMarker(): void {
    var popupText :string ;
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      popupText = `Location:${event.latlng}`;
      this.latt = lat;
      this.long = lng;

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      this.marker = L.marker([lat, lng], { icon: this.smallIcon, draggable: true }).on('dragend', (dragEvent: L.LeafletEvent) => {
        const newLatLng = dragEvent.target.getLatLng();
        this.latt = newLatLng.lat;
        this.long = newLatLng.lng;
       popupText = `Location: ${this.latt.toFixed(7)}, ${this.long.toFixed(7)}`;
        this.marker.setPopupContent(popupText); 
    this.marker.openPopup();
      })
        .addTo(this.map)
        .bindPopup(popupText)
        .openPopup();
      this.addForm.patchValue({
        lat: this.latt,
        lng: this.long
      });

    });

    this.map.on('contextmenu', () => {
      this.map.removeLayer(this.marker);
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

  private createCustomPopup(stop: Stop) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(StopPopupComponent);
    const component = factory.create(this.injector);
    component.instance.StopName = stop.name_fr;
    component.changeDetectorRef.detectChanges();
    const wrapperDiv = document.createElement('div');
    wrapperDiv.appendChild(component.location.nativeElement);

    // Add update and delete buttons to the wrapperDiv
    const updateButton = document.createElement('button');
    updateButton.textContent = 'update';
    updateButton.className = 'text-black-100 font-medium mt-8 mr-2 bg-[#F8AF26] hover:shadow-2xl hover:bg-amber-700 focus:ring-4 focus:ring-amber-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2.5 text-center';
    updateButton.addEventListener('click', () => {
      component.instance.selected = stop;
      
      this.updateStop = stop;
      component.instance.updateStop();
    });
    wrapperDiv.appendChild(updateButton);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'delete';
    deleteButton.className = 'text-black-100 font-medium mt-8 bg-[#F8AF26] hover:shadow-2xl hover:bg-amber-700 focus:ring-4 focus:ring-amber-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2.5 text-center';
    deleteButton.addEventListener('click', () => {
      component.instance.selected = stop;
      
      component.instance.deleteStop(stop.id);
    });
    wrapperDiv.appendChild(deleteButton);

    return wrapperDiv;
  }

  onCheckboxChange(path: Path, isChecked: boolean): void {
    if (isChecked) {
      for (var p of this.paths) {
        if (p === path) {
          this.StartA = p.startFr;
          this.StartB = p.endFr;
          this.showStopMarkers(p.stops);
        }
      }
      this.addForm.get('path').setValue(path);
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
        this.updateRouting(startMarker, endMarker);
      }

      this.geoJsonLayer = L.geoJSON(geojsonData).addTo(this.map);
    } catch (error) {
      console.error('Error parsing or loading GeoJSON:', error);
    }
  }


  updateRouting(start: L.Marker, end: L.Marker): void {

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

  showStopMarkers(stops: Stop[]): void {
    this.clearMarkers();
    for (const stop of stops) {
      if (stop != null && stop.name_fr) {
        const marker = L.marker([stop.lat, stop.lng], { icon: this.stopIcon, draggable: true })
          .bindPopup(() => this.createCustomPopup(stop))
          .openPopup()
          .addTo(this.map);
        marker.on('dragend', (dragEvent: L.LeafletEvent) => {
          const newLatLng = dragEvent.target.getLatLng();
          this.addForm.get('lat').setValue(newLatLng.lat);
          this.addForm.get('lng').setValue(newLatLng.lng);
        });
        this.stopMarkers.push(marker);
      }
    }

  }

  private clearMarkers(): void {
    for (const marker of this.stopMarkers) {
      marker.removeFrom(this.map);
    }
    this.stopMarkers = [];
  }
  initialiszeroute(): void {
    if (this.routingControl) {
      this.removeRoutingControl();
    }

    if (this.routingPlan) {
      this.routingPlan.removeFrom(this.map);
      this.routingPlan = null;
    }
  }
  openWarningToast(message: string): void {
    this.snackBar.openFromComponent(WarningComponent, {
      data: { message: message }, duration: 5000,
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: ['snack-yellow', 'snack-size']
    });
  }
  fetchstops(){
    this._stopService.getstops().subscribe((stop)=>{
      this.stops = stop;
    })
  }
  selectedstop:any;
  onStopSelected() {
    const selectedStopName = this.addForm.get('selectedStop').value;
    console.log("selected : ",selectedStopName)
    const selectedStop = this.stops.find(stop => stop.name_fr === selectedStopName);
    this.selectedstop = selectedStop;
    if (selectedStop) {
      const { lat, lng } = selectedStop;
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker([lat, lng],{icon:this.stopIcon,draggable:true}).addTo(this.map);
      this.marker.bindPopup(()=>this.createCustomPopup(selectedStop)).openPopup(); 
      this.marker.on('dragend', (dragEvent: L.LeafletEvent) => {
        const newLatLng = dragEvent.target.getLatLng();
        this.addForm.get('lat').setValue(newLatLng.lat);
        this.addForm.get('lng').setValue(newLatLng.lng);
      });
      this.map.setView([lat, lng], 13);
    }
  }

  addStop(): void {
    const formValue = this.addForm.value;
    this.UpdateForm = this.fb.group({
      name_fr: new FormControl(this.addForm.get('name_fr').value, [Validators.required, Validators.minLength(2)]),
      name_ar: new FormControl(this.addForm.get('name_ar').value, [Validators.required, Validators.minLength(2)]),
      description: new FormControl(this.addForm.get('description').value),
      lat: new FormControl(this.addForm.get('lat').value, [Validators.required]),
      lng: new FormControl(this.addForm.get('lng').value, [Validators.required]),
      stopnumber: new FormControl(this.addForm.get('stopnumber').value, [Validators.required]),
      stopType: new FormControl(this.addForm.get('stopType').value, [Validators.required]),
      path: [this.addForm.get('path').value]
    });
    const stopData: Stop = this.UpdateForm.value;
    if (this.addForm.valid || this.selectedstop != null) {

      if (this.updateStop != null) {
        const id = this.updateStop.id;
        if (id) {
          this._stopService.updatepstop(stopData, id).subscribe(() => {
            this.message = "Arrêt mis à jour avec success";
          }, error => {
            const message = `Erreur l\'ors de mise à jour de nouvelle arrêt ${error.status}`;
            this.openfailToast(message);
          })
        }
      } else {
        this._stopService.addstop(formValue).subscribe(() => {
          this.message = "Arret ajouté avec succéss";
        }, error => {
          const message = `Erreur l\'ors de l\'ajout de nouvelle arrêt ${error.status}`;
          this.openfailToast(message);
        })
      }
    } else {
      this.openWarningToast("La Forme est invalide ou incomplet");
    }
  }
  removeRoutingControl(): void {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
    }
  }

  removeGeoJSONLayer(): void {

    if (this.routingControl && this.routingPlan) {
      this.initialiszeroute();
    }

    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
    if (this.startMarkerdraw) {
      this.map.removeLayer(this.startMarkerdraw);
      this.startMarkerdraw = null;
    }
    if (this.endMarkerdraw) {
      this.map.removeLayer(this.endMarkerdraw);
      this.endMarkerdraw = null;
    }
    if (this.geoJsonLayer) {
      this.map.removeLayer(this.geoJsonLayer);
      this.geoJsonLayer = null;
    }
  }

}
