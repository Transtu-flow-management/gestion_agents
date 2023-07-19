import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PathService } from '../../Services/path.service';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import * as L from 'leaflet';
import { Lines } from '../../interfaces/Lines';
import 'leaflet-routing-machine';
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import { WarningComponent } from 'src/app/alerts/warning/warning.component';
import { UpdateToastComponent } from 'src/app/alerts/update-toast/update-toast.component';
import 'leaflet-draw';
import * as MapboxSdk from '@mapbox/mapbox-sdk/services/directions';
import 'leaflet-polylineoffset';

const accessToken = 'sk.eyJ1Ijoib3VzczAxYW1hIiwiYSI6ImNsa2FiMjA1NjA2MHczZG8yZHpoenc5MW0ifQ.bjv3uS_nOm21zC0v2dS1MA';

function allowedValues(control: FormControl) {
  const value = control.value;

  if (value !== 0 && value !== 1) {
    return { invalidValue: true };
  }

  return null;
}

@Component({
  selector: 'app-update-path',
  templateUrl: './update-path.component.html',
  styleUrls: ['./update-path.component.css']
})
export class UpdatePathComponent implements AfterViewInit {
  public path: any;
  constructor(private route: Router, private elementRef: ElementRef,
    private http: HttpClient,
    private fb: FormBuilder, private _pathsertvice: PathService,
    private snackBar: MatSnackBar) {
    if (this.route.getCurrentNavigation().extras.state) {
      let path = this.route.getCurrentNavigation().extras.state['pathData'];
      this.updateForm = this.fb.group({
        startFr: new FormControl(path.startFr || '', [Validators.required, Validators.minLength(4)]),
        startAr: new FormControl(path.startAr || '', [Validators.required, Validators.minLength(4)]),
        endFr: new FormControl(path.endFr || '', [Validators.required, Validators.minLength(4)]),
        endAr: new FormControl(path.endAr || '', [Validators.required, Validators.minLength(4)]),
        type: new FormControl(path.type || 0, [Validators.required, allowedValues]),
        data: new FormControl(path.data || '', [Validators.required]),
        line: new FormControl(path.line.id, [Validators.required]),
      })
    }
  }


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
  public data: string;
  updateForm: FormGroup;
  isFormSubmitted = false;
  drawControl: any;
  drawnFeatures: L.FeatureGroup;

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



  update(): void {
    this.isFormSubmitted = true;

    const formvalue = this.updateForm.getRawValue();
    const selectedLineId = formvalue.line;
    const selectedLine = this.lines.find(line => line.id === selectedLineId);
    formvalue.line = selectedLine;


    if (this.updateForm.invalid) {
      console.log(formvalue);
      this.openWarningToast("Form invalide ou incomplet!");
    } else {
      const selectedLineId = formvalue.line;
      const selectedLine = this.lines.find(line => line.id === selectedLineId);
      formvalue.line = selectedLine;

      this._pathsertvice.updatepaths(formvalue, this.path.id).subscribe(
        () => {

          console.log(formvalue);
          this.openAddToast('Traget modifié avec succès');
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
    this.snackBar.openFromComponent(UpdateToastComponent, {
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
      minZoom: 8,

    });
    this.drawnFeatures = new L.FeatureGroup().addTo(this.map);
    this.drawControl = new (L.Control as any).Draw({
      edit: {
        featureGroup: this.drawnFeatures,
        remove: false
      },
      draw: {
        polygon: false,
        marker: false,
        circlemarker: false,
        circle: false,
        rectangle: false
      }
    });

    this.map.addControl(this.drawControl);

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
    let routingPolyline: L.Polyline = null;

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
      if (routingPolyline) {
        this.map.removeLayer(routingPolyline);
      }

    };
    this.updateForm.get('startFr').valueChanges.subscribe(() => {
      updateRouting();
    });
    this.updateForm.get('startAr').valueChanges.subscribe(() => {
      updateRouting();
    });
    this.updateForm.get('endFr').valueChanges.subscribe(() => {
      updateRouting();
    });
    this.updateForm.get('endAr').valueChanges.subscribe(() => {
      updateRouting();
    });
    const directionsService = MapboxSdk.Directions({
      accessToken: accessToken,
    });
    const updateRouting = async (): Promise<void> => {
      if (startMarker && endMarker) {
        // Get the coordinates of the start and end markers
        const startLatLng = startMarker.getLatLng();
        const endLatLng = endMarker.getLatLng();
    
        // Request the routing data from Mapbox Directions API
        const routingData = await directionsService.getRoute({
          waypoints: [
            { coordinates: [startLatLng.lng, startLatLng.lat] },
            { coordinates: [endLatLng.lng, endLatLng.lat] },
          ],
          profile: 'mapbox/driving', // Replace with the appropriate profile (e.g., 'mapbox/walking', 'mapbox/cycling', etc.)
        }).send();
    
        // Get the routing points from the response
        const routingPoints = routingData.body.routes[0].geometry.coordinates.map((point) => L.latLng(point[1], point[0]));
    
        // Remove the old routing polyline if it exists
        if (routingPolyline) {
          this.map.removeLayer(routingPolyline);
        }
    
        // Draw the new routing polyline
        routingPolyline = L.polyline(routingPoints, { color: 'red' }).addTo(this.map);
      }
    };

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
    
      if (!startMarker) {
        startMarker = L.marker([lat, lng]).addTo(this.map);
      } else if (!endMarker) {
        endMarker = L.marker([lat, lng]).addTo(this.map);
    
        // Get the route between startMarker and endMarker using Mapbox Directions API
        const accessToken = 'sk.eyJ1Ijoib3VzczAxYW1hIiwiYSI6ImNsa2FiMjA1NjA2MHczZG8yZHpoenc5MW0ifQ.bjv3uS_nOm21zC0v2dS1MA';
        const profile = 'mapbox/driving'; // You can change the profile based on your requirements (e.g., mapbox/walking, mapbox/cycling, etc.)
        const serviceUrl = 'https://api.mapbox.com/directions/v5';
        const waypoints = `${startMarker.getLatLng().lng},${startMarker.getLatLng().lat};${endMarker.getLatLng().lng},${endMarker.getLatLng().lat}`;
        const url = `${serviceUrl}/${profile}/${waypoints}?access_token=${accessToken}`;
    
        this.http.get(url).subscribe(
          (response: any) => {
            if (response.routes && response.routes.length > 0) {
              const route = response.routes[0].geometry;
              const routePolyline = L.polyline((L.Polyline as any).fromEncoded(route), { color: 'blue' }).addTo(this.map);
              this.map.fitBounds(routePolyline.getBounds());
            }
          },
          (error) => {
            console.error('Error fetching route:', error);
          }
        );
      } else {
        return null;
      }
    
      let geoJSON = savedData.toGeoJSON();
      let data = JSON.stringify(geoJSON);
      this.updateForm.get('data').setValue(data);
    });
    this.map.on('contextmenu', () => {
      clearMarkersAndRouting();

    });




    const loadbutton = L.Control.extend({
      options: {
        position: 'topleft',
      },
      onAdd: (map: L.Map) => {
        const buttonl = L.DomUtil.create('button', 'load-button');
        buttonl.innerHTML = 'Load';
        buttonl.addEventListener('click', () => {
          clearMarkersAndRouting();
          const geoJSONString = this.updateForm.get('data').value;
          const geoJSON = JSON.parse(geoJSONString);
          const features = geoJSON.features;
          const startCoordinates = features[0].geometry.coordinates;
          const endCoordinates = features[features.length - 1].geometry.coordinates;
          startMarker = L.marker([startCoordinates[1], startCoordinates[0]]);
          endMarker = L.marker([endCoordinates[1], endCoordinates[0]]);
          updateRouting();

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