import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-reseau',
  templateUrl: './reseau.component.html',
  styleUrls: ['./reseau.component.css']
})
export class ReseauComponent implements OnInit{
  private map: L.Map;
  private marker: L.Marker;
  private latLng: L.LatLng;
  ngOnInit() {
    this.initMap();
  }

  private initMap() {
    // Create the map
    this.map = L.map('map').setView([51.505, -0.09], 13);

    // Add the tile layer (replace 'mapbox/streets-v11' with your preferred tile provider)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Add click event listener to the map
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.handleMapClick(event);
    });
  }

  private handleMapClick(event: L.LeafletMouseEvent) {
    // Remove existing marker if present
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Add marker to the clicked position
    this.latLng = event.latlng;
    this.marker = L.marker(this.latLng).addTo(this.map);
  }

  public getLatLng() {
    if (this.latLng) {
      const lat = this.latLng.lat;
      const lng = this.latLng.lng;
      console.log('Latitude:', lat);
      console.log('Longitude:', lng);
    } else {
      console.log('No marker has been placed on the map.');
    }
  }
}
