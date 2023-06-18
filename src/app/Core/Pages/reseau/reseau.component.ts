import { Component, AfterViewInit, ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-reseau',
  templateUrl: './reseau.component.html',
  styleUrls: ['./reseau.component.css']
})
export class ReseauComponent implements AfterViewInit {
  map: L.Map;
  smallIcon: L.Icon;
  marker: L.Marker;
  private latt :number;
  private long : number;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.createMap();
    this.initializeMarkerIcon();
    this.enableClickToAddMarker();
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
      minZoom: 4,
      maxZoom: 17,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    mainLayer.addTo(this.map);
  }

  initializeMarkerIcon(): void {
    this.smallIcon = new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
  }

  enableClickToAddMarker(): void {
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      const popupText = `Clicked Location: ${lat}, ${lng}`;
      this.latt=lat;
      this.long=lng;
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      console.log("latt =",this.latt," long = ",this.long);
      this.marker = L.marker([lat, lng], { icon: this.smallIcon })
        .addTo(this.map)
        .bindPopup(popupText)
        .openPopup();
    });

  }
}
