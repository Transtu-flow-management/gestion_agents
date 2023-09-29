import { Component, ElementRef, AfterViewInit,ViewContainerRef,ViewChild, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PathService } from '../../Services/path.service';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import * as L from 'leaflet';
import { Lines } from '../../Models/Lines';
import 'leaflet-routing-machine';
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import { WarningComponent } from 'src/app/alerts/warning/warning.component';
import { DynamicPopupComponent } from '../../Pages/dynamic-popup/dynamic-popup.component';
import { Path } from '../../Models/Path';
import { Observable, map, startWith } from 'rxjs';

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
export class AddPathComponent implements AfterViewInit,OnInit {
  @ViewChild('popupPlaceholder', { read: ViewContainerRef }) popupPlaceholder!: ViewContainerRef;

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';c
  lines: Lines[] = [];
  Path:Path[] = [];
  showdialg: boolean = true;
  map: L.Map;
  smallIcon: L.Icon;
  redicon: L.Icon;
  marker: L.Marker;
  public data:string;
  filteredOptions: Observable<Path[]>;
  filteredOptionsAR: Observable<Path[]>;
  filteredOptionsEF: Observable<Path[]>;
  filteredOptionsEA: Observable<Path[]>;
  addForm: FormGroup;
  startfr = new FormControl<Path>(null);
  startar = new FormControl<Path>(null);
  endfr = new FormControl<Path>(null);
  endar = new FormControl<Path>(null);
  componentRef: any;
  isFormSubmitted = false;
  constructor(private elementRef: ElementRef, private http: HttpClient,
    private viewContainerRef: ViewContainerRef,
     private fb: FormBuilder, private _pathsertvice: PathService,
      private snackBar: MatSnackBar) {
    this.addForm = this.fb.group({
     
      startFr: new FormControl(this.startfr, [Validators.required,Validators.minLength(4)]),
      startAr: new FormControl(this.startar, [Validators.required,Validators.minLength(4)]),
      endFr: new FormControl(this.endfr, [Validators.required,Validators.minLength(4)]),
      endAr: new FormControl(this.endar, [Validators.required,Validators.minLength(4)]),
      type:new FormControl('', [Validators.required]),
      data:new FormControl('', [Validators.required]),
      line:new FormControl('', [Validators.required]),
    })
  }
  arabicTextValidator() {
    return (control) => {
      const arabicTextPattern = /^[\u0600-\u06FF\s]+$/;
      if (!arabicTextPattern.test(control.value)) {
        return { notArabic: true };
      }
      return null;
    };
  }
 showPopup() {
    this.viewContainerRef.clear();
    const componentRef = this.viewContainerRef.createComponent(DynamicPopupComponent);

    componentRef.instance.addForm = this.addForm;
    componentRef.instance.isFormSubmitted = this.isFormSubmitted;
  }

  capaciteValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value > 999)) {
      return { maxLength: true };
    }
    return null;
  }
  ngOnInit(): void {
    this._pathsertvice.retreivePathss().subscribe((pats)=>{
      this.Path = pats;
    },(err)=>{
      console.log(err);
    })
    
    this.filteredOptions = this.startfr.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.startFr;
        return name ? this._filter(name as string) : this.Path.slice();
      })
    );
    this.filteredOptionsAR = this.startar.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.startAr;
        return name ? this._filterSA(name as string) : this.Path.slice();
      })
    );
    this.filteredOptionsEF = this.endfr.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.endFr;
        return name ? this._filterEF(name as string) : this.Path.slice();
      })
    );
    this.filteredOptionsEA = this.endar.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.endAr;
        return name ? this._filterEA(name as string) : this.Path.slice();
      })
    );
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
      const selectedSfr :Path = this.startfr.value;
      formvalue.startFr = selectedSfr.startFr;
      const selectedSar :Path = this.startar.value;
      formvalue.startAr = selectedSfr.startAr;
      const selectedEfr :Path = this.endfr.value;
      formvalue.endFr = selectedSfr.endFr;
      const selectedEar :Path = this.endar.value;
      formvalue.endAr = selectedSfr.endAr;
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
  displayFn(path: Path): string {
    return path && path.startFr ? path.startFr : '';
  }
  private _filter(name: string): Path[] {
    const filterValue = name.toLowerCase();
    const uniqueStartArValues = new Set<string>();
    const uniquePaths: Path[] = this.Path.filter((option) => {
      const startArLowerCase = option.startFr.toLowerCase();
      if (startArLowerCase.includes(filterValue) && !uniqueStartArValues.has(startArLowerCase)) {
        uniqueStartArValues.add(startArLowerCase);
        return true;
      }
      return false;
    });
  
    return uniquePaths;
  }
  
  displayFnSA(path: Path): string {
    return path && path.startAr ? path.startAr : '';
  }
  private _filterSA(name: string): Path[] {
    const filterValue = name.toLowerCase();
    const uniqueStartArValues = new Set<string>();
    const uniquePaths: Path[] = this.Path.filter((option) => {
      const startArLowerCase = option.startAr.toLowerCase();
      if (startArLowerCase.includes(filterValue) && !uniqueStartArValues.has(startArLowerCase)) {
        uniqueStartArValues.add(startArLowerCase);
        return true;
      }
      return false;
    });
  
    return uniquePaths;
  }
  displayFnEF(path: Path): string {
    return path && path.endFr ? path.endFr : '';
  }
  private _filterEF(name: string): Path[] {
    const filterValue = name.toLowerCase();
    const uniqueStartArValues = new Set<string>();
    const uniquePaths: Path[] = this.Path.filter((option) => {
      const startArLowerCase = option.endFr.toLowerCase();
      if (startArLowerCase.includes(filterValue) && !uniqueStartArValues.has(startArLowerCase)) {
        uniqueStartArValues.add(startArLowerCase);
        return true;
      }
      return false;
    });
  
    return uniquePaths;
  }
  displayFnEA(path: Path): string {
    return path && path.endAr ? path.endAr : '';
  }
  private _filterEA(name: string): Path[] {
    const filterValue = name.toLowerCase();
    const uniqueStartArValues = new Set<string>();
    const uniquePaths: Path[] = this.Path.filter((option) => {
      const startArLowerCase = option.endAr.toLowerCase();
      if (startArLowerCase.includes(filterValue) && !uniqueStartArValues.has(startArLowerCase)) {
        uniqueStartArValues.add(startArLowerCase);
        return true;
      }
      return false;
    });
  
    return uniquePaths;
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
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors Oussama Omrani'
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
    let startMarkerdraw: L.Marker;
    let endMarkerdraw: L.Marker;
    let routingPlan: L.Routing.Plan;
    let routingControl: L.Routing.Control;
    let savedData: L.LayerGroup = L.layerGroup(); 
    let loadedData: L.LayerGroup = L.layerGroup(); 
    let geoJSONLayer: L.GeoJSON;
    let drawnFeatures: L.FeatureGroup;
    let drawControl: any;
    let isDrawing: boolean;
    let lineExists : boolean;
    let drawnPolylines: L.Polyline[] = [];
    let markerDragged: boolean = false;
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

      if (startMarkerdraw) {
        savedData.removeLayer(startMarkerdraw);
        this.map.removeLayer(startMarkerdraw);
        startMarkerdraw = null;
      }

      if (endMarkerdraw) {
        savedData.removeLayer(endMarkerdraw);
        this.map.removeLayer(endMarkerdraw);
        endMarkerdraw = null;
      }

      if (geoJSONLayer) {
        loadedData.removeLayer(geoJSONLayer);
        this.map.removeLayer(geoJSONLayer);
        geoJSONLayer = null;
      }
      if (drawnFeatures) {
        savedData.removeLayer(drawnFeatures);
        drawnFeatures.clearLayers();
      }
   
    };
 

    const initialiszeroute = (): void => {
      if (routingControl) {
        this.map.removeControl(routingControl);
        routingControl = null;
      }

      if (routingPlan) {
        routingPlan.removeFrom(this.map);
        routingPlan = null;
      }
    }
    const updateRouting = (): void => {
      if (startMarker && endMarker) {
        const popupTextS = `Location FR: ${this.addForm.get('startFr').value} <br> Location AR:${this.addForm.get('startAr').value}`;
        const popupTextE = `Location FR: ${this.addForm.get('endFr').value} <br> Location AR:${this.addForm.get('endAr').value}`;
        initialiszeroute();
        routingPlan = new L.Routing.Plan([startMarker.getLatLng(), endMarker.getLatLng()], {
          createMarker: (i, waypoints, n) => {
            if (i === 0) {
              startMarker = L.marker(waypoints.latLng, { icon: this.smallIcon, draggable: true }).on('dragend', onDragEndStart).bindPopup(popupTextS).openPopup()
              savedData.addLayer(startMarker)
              return startMarker;
            } else if (i === n - 1) {
              endMarker = L.marker(waypoints.latLng, { icon: this.redicon, draggable: true }).on('dragend', onDragEndEnd).bindPopup(popupTextE).openPopup()
              savedData.addLayer(endMarker)
              return endMarker;
            }
            return null;
          },
        });

        routingPlan.addTo(this.map);

        routingControl = L.Routing.control({
          //router:(L.Routing as any).mapbox('pk.eyJ1Ijoib3VzczAxYW1hIiwiYSI6ImNsa2FheW41MzA1Z3ozZG13dGpiZjl4d2YifQ.zBUhApqgliMB7y1zR3ODWw'),
          plan: routingPlan,
          lineOptions: {
            styles: [{ color: 'blue', opacity: 0.6, weight: 9 },
            { color: 'white', opacity: 0.6, weight: 6 },
            ],
            extendToWaypoints: false,
            missingRouteTolerance: 0,
          },
          addWaypoints: false,
        });
        routingControl.addTo(this.map);

      }
    };
    const onDragEndStart = (event: L.LeafletEvent): void => {
   
      startMarker.options.draggable = true;
      const latlng = (event.target as L.Marker).getLatLng();
      startMarker.setLatLng(latlng);
      markerDragged = true;
    };

    const onDragEndEnd = (event: L.LeafletEvent): void => {
      endMarker.options.draggable = true;
      const latlng = (event.target as L.Marker).getLatLng();
      endMarker.setLatLng(latlng);
      markerDragged = true;

    };

    if (!drawnFeatures) {
      drawnFeatures = new L.FeatureGroup().addTo(this.map);

      drawControl = new (L.Control as any).Draw({
        edit: {
          featureGroup: drawnFeatures,
          remove: false
        },
        draw: {
          polyline: {
            shapeOptions: {
              color: 'green',
            },
          },
          polygon: false,
          marker: false,
          circlemarker: false,
          circle: false,
          rectangle: false,

        }

      });

      this.map.addControl(drawControl);

    };
    

    this.map.on('draw:created', (event: L.LeafletEvent) => {
      const layer: L.Layer = event.layer;
      if (lineExists){
        lineExists =false;
        return;
      }
      if (layer instanceof L.Polyline) {
        drawnPolylines.push(layer);
        drawnFeatures.addLayer(layer);
        savedData.addLayer(drawnFeatures);
        lineExists= true;
          // @ts-ignore
        const latlngs: L.LatLng[] = layer.getLatLngs(); 
        startMarkerdraw = L.marker(latlngs[0]);
        startMarkerdraw.setIcon(this.smallIcon)
    endMarkerdraw = L.marker(latlngs[latlngs.length - 1]);
    endMarkerdraw.setIcon(this.redicon)
    startMarkerdraw.addTo(this.map);
    endMarkerdraw.addTo(this.map);
        let geoJSON = savedData.toGeoJSON();
        let data = JSON.stringify(geoJSON);
        this.addForm.get('data').setValue(data);
        console.log(this.addForm.get('data').value);
       
      }
    });
    const updateMarkerPositions = (polyline: L.Polyline): void => {
      // @ts-ignore
      const latlngs: L.LatLng[] = polyline.getLatLngs();
    
      if (latlngs.length >= 2) {
        startMarkerdraw.setLatLng(latlngs[0]);
        endMarkerdraw.setLatLng(latlngs[latlngs.length - 1]);
      }
    };

    this.map.on('draw:edited', (event: L.LeafletEvent) => {
      // @ts-ignore
      const layers: L.Layer[] = (event).layers.getLayers();
    
      for (const layer of layers) {
        if (layer instanceof L.Polyline) {
          // @ts-ignore
          const oldLayer = drawnFeatures.getLayer(layer._leaflet_id);
          if (oldLayer) {
            drawnFeatures.removeLayer(oldLayer);
          }
    
         
          drawnFeatures.addLayer(layer);
          updateMarkerPositions(layer);
    
          const geoJSON = savedData.toGeoJSON();
          const data = JSON.stringify(geoJSON);
          this.addForm.get('data').setValue(data);
          console.log(drawnFeatures.getLayers().length);
          console.log(this.addForm.get('data').value);
        }
      }
    });
    this.map.on('draw:drawvertex', () => {
      if (!lineExists) {
        if (startMarker && endMarker) {
          isDrawing = false;
          lineExists = true;
        } else {
          isDrawing = true;
        }
      } else {
        isDrawing = false;
      }
      
    });
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      if (lineExists) {
        return;
      }

      if (isDrawing) {
        isDrawing = false;
        return;
      }
      savedData.clearLayers();

      if (!startMarker) {
        startMarker = L.marker([lat, lng])

      } else if (!endMarker) {
        endMarker = L.marker([lat, lng])

      } else {
        return null;
      }
      updategeojson()


    });
    const updategeojson = (): void => {
      updateRouting();
      if (startMarker && endMarker){
      let geoJSON = savedData.toGeoJSON();
      let data = JSON.stringify(geoJSON);
      this.addForm.get('data').setValue(data);
      console.log(data);
      }
    }


    this.map.on('contextmenu', () => {
      clearMarkersAndRouting();
      drawnFeatures.clearLayers();
      drawnPolylines.forEach((polyline) => this.map.removeLayer(polyline));
      drawnPolylines = [];
      lineExists = false;

    });

    const saveButton = L.Control.extend({
      options: {
        position: 'topleft',
      },
  
      onAdd: (map: L.Map) => {
        const button = L.DomUtil.create('button', 'save-button');
        button.innerHTML = 'Save';
        button.style.backgroundColor = 'white';
        button.style.color = 'black';
        button.style.padding = '6px 5px';
        button.style.border = '1px solid black';
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => {
          updategeojson();
        });
  
        return button;
      },
    });   
    this.map.addControl(new saveButton());   
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