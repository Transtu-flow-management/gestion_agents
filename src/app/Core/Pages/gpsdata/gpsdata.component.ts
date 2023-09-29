import { Component, OnInit,ElementRef } from '@angular/core';

import { GpsServiceService } from '../../Services/gps-service.service';
import * as L from 'leaflet';
import { error } from 'jquery';
import { CarService } from '../../Services/car.service';
import { Car } from '../../Models/Car';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GPS } from '../../Models/Gps';
import { Stop } from '../../Models/Stop';
import { StopserviceService } from '../../Services/stopservice.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-gpsdata',
  templateUrl: './gpsdata.component.html',
  styleUrls: ['./gpsdata.component.css']
})
export class GpsdataComponent implements OnInit{

  gpsData: GPS; 
  matricule: string;
  Cars : Car[] = [];

  map: L.Map;
  marker: L.Marker;
  smallIcon: L.Icon;
  start: L.Icon;
  stop: L.Icon;
  stopMarkers: L.Marker[] = []
  end :L.Icon;
  lat: number = 0; 
  stops:Stop[] = [];
  lng: number = 0; 
  speed : number = 0;
  startMarkerdraw: L.Marker;
  endMarkerdraw: L.Marker;
  routingControl: L.Routing.Control;
  routingPlan: L.Routing.Plan;
  private geoJsonLayer: L.GeoJSON;
  dataReceived : boolean = false;
  constructor(private _gpsservice:GpsServiceService,private elementRef: ElementRef,private router:Router,
    private _vehiculeservice: CarService,private _stopService:StopserviceService,private snackBar:MatSnackBar){
    this.matricule ='';
  }

  ngOnInit(): void {
     
      this.createMap();
      this.initializeMarkerIcon();
      this.getDataFromServer();
      this.getcars();
     
  }
  openHistory() {
    this.router.navigate(['history'])
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
      iconUrl: 'assets/place-marker.gif',
      iconSize: [44, 41],
      iconAnchor: [12, 41],
     
    });

    this.smallIcon = new L.Icon({
      iconUrl: '/assets/place-marker.gif',
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      iconSize :[30,30]
    });

    this.start = new L.Icon({
      iconUrl: '/assets/images/station.png',
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      iconSize :[60,60]
  
    });

    this.stop = new L.Icon({
      iconUrl: '/assets/images/green/busstop.png',
      iconAnchor: [12, 41],
    });
    this.end =  new L.Icon({
      iconUrl: '/assets/images/station.png',
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      iconSize :[60,60]
    });
    this.marker = L.marker([this.lat, this.lng],{icon:this.smallIcon}).addTo(this.map);

  }
  senddata(id:string){
    if (id!=""){
      this._gpsservice.send({matricule:id});
      console.log("data sent :",id)
      this.showpathOnmap();
      
    }
  }

  getcars():void{
this._vehiculeservice.findcars().subscribe((cars)=>{
  this.Cars = cars;
  console.log(this.Cars)
},(error)=>{
  const message = `Error fetching cars${error.status}`;
  this.openfailToast(message);
})
  }
  openfailToast(message: string): void {
    this.snackBar.openFromComponent(FailedToastComponent, {
      data: { message: message }, duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "bottom",
      panelClass: ['snack-red', 'snack-size']
    });
  }
  fetchstops(){
    this._stopService.getstops().subscribe((stop)=>{
      this.stops = stop;
    })
  }
  showStopMarkers(stops: Stop[]): void {
    this.clearMarkers();
    for (const stop of stops) {
      if (stop != null && stop.name_fr) {
        const marker = L.marker([stop.lat, stop.lng], { icon: this.stop })
          .addTo(this.map);
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
  showpathOnmap(){
   const selectedvehiucle = this.Cars.find(car => car.matricule ===this.matricule);
   const path =  selectedvehiucle.path
    if (path != null){
      this.loadAndDisplayGeoJSON(selectedvehiucle.path.data);
      this.showStopMarkers(path.stops);
      console.log("showed : ",selectedvehiucle);
    }else{
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
          this.startMarkerdraw = L.marker([firstC[1], firstC[0]]).setIcon(this.start).addTo(this.map);
          this.endMarkerdraw = L.marker([lastC[1], lastC[0]]).setIcon(this.end).addTo(this.map);
        }
      }
      const features = geojsonData.features;
      if (features[0].geometry.type === 'Point') {
        const startCoordinates = features[0].geometry.coordinates;
        const endCoordinates = features[features.length - 1].geometry.coordinates;
        const startMarker = L.marker([startCoordinates[1], startCoordinates[0]],{icon:this.start});
        const endMarker = L.marker([endCoordinates[1], endCoordinates[0]],{icon:this.end})
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


  removeGeoJSONLayer(): void {

    if (this.routingControl && this.routingPlan) {
      this.initialiszeroute();
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

  initialiszeroute(): void {
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



  getDataFromServer() {

  
    this._gpsservice.receive().subscribe((data:GPS) => {
         
      this.gpsData = data;
      this.lat = data.lat;
      this.lng = data.lang;
      const speedPattern = /Speed:([\f.]+)/;
      const fulldata = data.fullData;
      const parts = fulldata.split(',');
      let speedPart = '';
for (const part of parts) {
  if (part.includes('Speed')) {
    speedPart = part;
    break;
  }
}const speedMatch = speedPart.match(/Speed:(\S+)/);
if (speedMatch && speedMatch.length > 1) {
  const speed = parseFloat(speedMatch[1]);
  this.speed = speed;
  console.log('Speed:', this.speed);
} else {
  console.error('Speed not found in the string');
}

      this.dataReceived = true;
      console.log(this.gpsData);
      console.log(this.lat,this.lng);
     
      this.marker.setLatLng([this.lat, this.lng]);
      this.map.panTo([this.lat, this.lng]);
  },error =>{
      console.error("ws: error",error)
    });
  }
  
  ngOnDestroy() {
    // Close the WebSocket connection when the component is destroyed
    this._gpsservice.close();
  }

}
