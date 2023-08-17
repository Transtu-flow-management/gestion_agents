import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PathService } from '../../Services/path.service';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import * as L from 'leaflet';
import { Lines } from '../../Models/Lines';
import 'leaflet-routing-machine';
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import { WarningComponent } from 'src/app/alerts/warning/warning.component';
import { UpdateToastComponent } from 'src/app/alerts/update-toast/update-toast.component';
import 'leaflet-draw';
import { event } from 'jquery';
import { style } from '@angular/animations';
import { Path } from '../../Models/Path';


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
      let pathData = this.route.getCurrentNavigation().extras.state['pathData'];
      if (pathData) {
        this.path = pathData;

        this.updateForm = this.fb.group({
          startFr: new FormControl(pathData.startFr || '', [Validators.required, Validators.minLength(4)]),
          startAr: new FormControl(pathData.startAr || '', [Validators.required, Validators.minLength(4)]),
          endFr: new FormControl(pathData.endFr || '', [Validators.required, Validators.minLength(4)]),
          endAr: new FormControl(pathData.endAr || '', [Validators.required, Validators.minLength(4)]),
          type: new FormControl(pathData.type || 0, [Validators.required, allowedValues]),
          data: new FormControl(pathData.data || '', [Validators.required]),
          line: new FormControl(pathData.line.id, [Validators.required]),
        })
      }
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



    var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {

      maxZoom: 16,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {

      maxZoom: 19,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    var mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

      maxZoom: 19,
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
    let startMarkerdraw: L.Marker;
    let endMarkerdraw: L.Marker;
    let routingPlan: L.Routing.Plan;
    let routingControl: L.Routing.Control;
    let savedData: L.LayerGroup = L.layerGroup();
    let loadedData: L.LayerGroup = L.layerGroup();
    let isDrawing: boolean;
    let lineExists: boolean;
    let drawnPolylines: L.Polyline[] = [];
    let drawControl: any;
    let drawnFeatures: L.FeatureGroup;

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

    this.updateForm.get('startFr').valueChanges.subscribe(() => {
      updateMarkerPopupContent();
    });
    this.updateForm.get('startAr').valueChanges.subscribe(() => {
      updateMarkerPopupContent();
    });
    this.updateForm.get('endFr').valueChanges.subscribe(() => {
      updateMarkerPopupContent();
    });
    this.updateForm.get('endAr').valueChanges.subscribe(() => {
      updateMarkerPopupContent();
    });
    const updateMarkerPopupContent = (): void => {
      const startPopupText = `Location FR: ${this.updateForm.get('startFr').value} <br> Location AR:${this.updateForm.get('startAr').value}`;
      const endPopupText = `Location FR: ${this.updateForm.get('endFr').value} <br> Location AR:${this.updateForm.get('endAr').value}`;

      if (startMarker) {
        startMarker.setPopupContent(startPopupText);
      }

      if (endMarker) {
        endMarker.setPopupContent(endPopupText);
      }
    };

    const updateRouting = (): void => {
      if (startMarker && endMarker) {
        const popupTextS = `Location FR: ${this.updateForm.get('startFr').value} <br> Location AR:${this.updateForm.get('startAr').value}`;
        const popupTextE = `Location FR: ${this.updateForm.get('endFr').value} <br> Location AR:${this.updateForm.get('endAr').value}`;
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
    };

    const onDragEndEnd = (event: L.LeafletEvent): void => {
      endMarker.options.draggable = true;
      const latlng = (event.target as L.Marker).getLatLng();
      endMarker.setLatLng(latlng);
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
      if (lineExists) {
        lineExists = false;
        return;
      }
      if (layer instanceof L.Polyline) {
        drawnPolylines.push(layer);
        drawnFeatures.addLayer(layer);
        savedData.addLayer(drawnFeatures);
        lineExists = true;
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
        this.updateForm.get('data').setValue(data);
        console.log(this.updateForm.get('data').value);

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

          savedData.addLayer(layer);
          drawnFeatures.addLayer(layer);
          updateMarkerPositions(layer);

          const geoJSON = savedData.toGeoJSON();
          const data = JSON.stringify(geoJSON);
          this.updateForm.get('data').setValue(data);
          console.log(drawnFeatures.getLayers().length);
          console.log(this.updateForm.get('data').value);
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
      if (startMarker && endMarker) {
        let geoJSON = savedData.toGeoJSON();
        let data = JSON.stringify(geoJSON);
        this.updateForm.get('data').setValue(data);
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


    // @ts-ignore
    const onEachFeature = (feature: L.GeoJSON.Feature, layer: L.Layer): void => {
      if (drawnFeatures) {
        drawnFeatures.addLayer(layer);
      }

    }


    const loadbutton = L.Control.extend({
      options: {
        position: 'topleft',
      },
      onAdd: (map: L.Map) => {
        const buttonl = L.DomUtil.create('button', 'load-button');
        buttonl.innerHTML = 'Load';
        buttonl.style.backgroundColor = 'white';
        buttonl.style.color = 'black';
        buttonl.style.padding = '6px 5px';
        buttonl.style.border = '1px solid black';
        buttonl.style.cursor = 'pointer';
        buttonl.addEventListener('click', () => {
          clearMarkersAndRouting();
          const geoJSONString = this.updateForm.get('data').value;
          const geoJSON = JSON.parse(geoJSONString);
          const features = geoJSON.features;
          if (features[0].geometry.type === 'Point') {
            const startCoordinates = features[0].geometry.coordinates;
            const endCoordinates = features[features.length - 1].geometry.coordinates;
            startMarker = L.marker([startCoordinates[1], startCoordinates[0]]);
            endMarker = L.marker([endCoordinates[1], endCoordinates[0]]);
            updateRouting()
          }


          if (loadedData) {
            map.removeLayer(loadedData);
          }
          for (const feature of geoJSON.features) {
            if (feature.geometry.type === 'LineString') {
              const loadedpoly = L.geoJSON(geoJSON, { style: { color: 'green', "weight": 6, "opacity": 0.65 }, onEachFeature: onEachFeature });
              loadedData = L.layerGroup([loadedpoly]);
              loadedData.addTo(this.map);
              lineExists = true;
              const coordinates = feature.geometry.coordinates;
              const firstC = coordinates[0];
              const lastC = coordinates[coordinates.length - 1];
              startMarkerdraw = L.marker([firstC[1], firstC[0]]).setIcon(this.smallIcon).addTo(this.map);
              endMarkerdraw = L.marker([lastC[1], lastC[0]]).setIcon(this.redicon).addTo(this.map);
              isDrawing = false
              console.log(geoJSON)

            }
          }

        });
        return buttonl;
      }
    });
    this.map.addControl(new loadbutton);
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
          updategeojson()
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