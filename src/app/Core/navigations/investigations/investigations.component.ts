import { Component, ElementRef, OnInit } from '@angular/core';
import { Car } from '../../Models/Car';
import * as L from 'leaflet';
import { CarService } from '../../Services/car.service';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-investigations',
  templateUrl: './investigations.component.html',
  styleUrls: ['./investigations.component.css']
})
export class InvestigationsComponent implements OnInit {
  Cars: Car[] = [];
  matricule: string;
  map: L.Map;
  constructor(private _vehiculeservice: CarService, private snackBar: MatSnackBar,private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.createMap();
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


  getcars(): void {
    this._vehiculeservice.findcars().subscribe((cars) => {
      this.Cars = cars;
      console.log(this.Cars)
    }, (error) => {
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
}
