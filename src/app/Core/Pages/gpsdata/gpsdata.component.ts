import { Component, OnInit,ElementRef } from '@angular/core';
import { GPS, gpsData } from '../../Models/Gps';
import { GpsServiceService } from '../../Services/gps-service.service';
import * as L from 'leaflet';
import { error } from 'jquery';
@Component({
  selector: 'app-gpsdata',
  templateUrl: './gpsdata.component.html',
  styleUrls: ['./gpsdata.component.css']
})
export class GpsdataComponent implements OnInit{

  gpsData: gpsData; 
  vehicleID: string;
  map: L.Map;
  marker: L.Marker;
  smallIcon: L.Icon;
  lat: number = 0; 
  lng: number = 0; 
  dataReceived : boolean = false;
  constructor(private _gpsservice:GpsServiceService,private elementRef: ElementRef){
    this.vehicleID ='';
  }

  ngOnInit(): void {
     
      this.createMap();
      this.initializeMarkerIcon();
      this.getDataFromServer();
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
      iconUrl: 'assets/place-marker.gif',
      iconSize: [44, 41],
      iconAnchor: [12, 41],
     
    });
    this.marker = L.marker([this.lat, this.lng],{icon:this.smallIcon}).addTo(this.map);

  }
  senddata(id:string){
    if (id!=""){
      this._gpsservice.send({VehiculeID:id});
      console.log("data sent :",id)
    }
  }
  
  getDataFromServer() {
    this._gpsservice.receive().subscribe((data:gpsData) => {
      this.gpsData = data;
      this.lat = data.lat;
      this.lng = data.lang;
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
