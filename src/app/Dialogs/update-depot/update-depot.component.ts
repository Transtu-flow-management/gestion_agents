import { Component, AfterViewInit, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntropotService } from 'src/app/Core/Services/entropot.service';
import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { switchMap, of } from 'rxjs';
import * as L from 'leaflet';
import { Depot } from 'src/app/Core/interfaces/depot';

@Component({
  selector: 'app-update-depot',
  templateUrl: './update-depot.component.html',
  styleUrls: ['./update-depot.component.css']
})
export class UpdateDepotComponent implements AfterViewInit {
  @ViewChild('map') mapElement: ElementRef;
  updateForm: FormGroup;
  Reseaux: String[];
  map: L.Map;
  smallIcon: L.Icon;
  marker: L.Marker;
  public latt: number;
  public long: number;
  public adresse: string;
  selectedReseau :string;
  constructor(
    private elementRef: ElementRef,
    private http: HttpClient,
    public dialogRef: MatDialogRef<UpdateDepotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _entrservice: EntropotService
  ) {
    
    const depot: any = data.depot;
    this.updateForm = fb.group({
      name: [depot.name],
      Reseaux :[depot.Reseaux],
      longitude: [depot.longitude],
      lattitude: [depot.lattitude],
      capacite: [depot.capacite],
      adresse: [depot.adresse],
      selectedReseau: [depot.selectedReseau],
    });

  }


  ngAfterViewInit(): void {
    this.updatMap();
    this.initializeMarkerIcon();
    this.enableClickToAddMarker();
    this._entrservice.retreiveReseaux().subscribe((resx) => {
      this.Reseaux = resx;
    });
    this.initMap();

  }
  public initMap():void{
    const oLatitude = this.data.depot.lattitude;
    const oLongitude = this.data.depot.longitude;

    if (oLatitude && oLongitude) {
      this.marker = L.marker([oLatitude, oLongitude], { icon: this.smallIcon })
        .addTo(this.map);
    }

    if (oLatitude && oLongitude) {
      this.getAddressFromCoordinates(oLatitude, oLongitude, 450).then((address: string) => {
        console.log('Address:', address);
        this.adresse = address;
        this.updateForm.patchValue({
          adresse: address,
          longitude: oLongitude,
          lattitude: oLatitude
        });
      });
    }
  }

  public update(): void {
    const depot = this.updateForm.getRawValue();
    const checkvalues = this.data.depot;
    var selected = this.updateForm.get('selectedReseau').value;
    if(depot.name === checkvalues.name &&
      depot.longitude === checkvalues.longitude &&
      depot.lattitude === checkvalues.lattitude &&
      depot.capacite === checkvalues.capacite &&
      depot.adresse === checkvalues.adresse &&
      depot.selectedReseau === checkvalues.selectedReseau){
      console.log("values not changed")
    }
    else{
    this._entrservice.updateEntropot(this.data.depot.id, depot).pipe(
      switchMap(()=>{
        if (selected){
          return this._entrservice.assigntoDep(this.data.depot.id,selected);
        }
        else{
          console.log("failed to assign Reeau");
          return of (null);
        }
      })
    ).subscribe((res)=>{
      console.log("entropot updated",res);
      this.dialogRef.close();
    },((error)=> {
      console.log('failed to update entropot',error);
    }))
    
  }
  }

  updatMap(): void {
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
      const popupText = `Location: ${this.adresse}`;
      this.latt = lat;
      this.long = lng;

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      this.marker = L.marker([lat, lng], { icon: this.smallIcon })
        .addTo(this.map)
        .bindPopup(popupText)
        .openPopup();

      this.getAddressFromCoordinates(lat, lng, 450).then((address: string) => {
        console.log('Address:', address, ' with long =', this.long, " and latt =", this.latt);
        this.adresse = address;
        this.updateForm.patchValue({
          adresse: address,
          longitude: this.long,
          lattitude: this.latt,
        });
      });
    });
  }

  getAddressFromCoordinates(lat: number, lng: number, radius: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&radius=${radius}`;

    return this.http.get(url)
      .toPromise()
      .then((response: any) => {
        if (response?.address) {
          const { road, city, country, suburb, village } = response.address;
          let address = '';
          if (road && city) {
            address += `${road}, ${city}`;
          } else {
            address += suburb ? `${suburb}, ` : '';
            address += village ? `${village}, ` : '';
            address += city ? `${city}` : '';
          }
          address += `, ${country}`;

          return address;
        }

        return 'Adresse non trouvée';
      })
      .catch(() => 'Adresse non trouvée');
  }
  getselected():String{
    var selectede = this.updateForm.get('selectedReseau').value;
    var selected =this.updateForm.get('selectedReseau').valueChanges.subscribe((value)=>{
      this.updateForm.patchValue({value});
      this.selectedReseau =value;
    })
    return selectede;
  }

}
