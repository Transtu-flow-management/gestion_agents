import { AfterViewInit, Component, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EntropotService } from 'src/app/Core/Services/entropot.service';
import { Depot } from 'src/app/Core/interfaces/depot';

@Component({
  selector: 'app-add-depo',
  templateUrl: './add-depo.component.html',
  styleUrls: ['./add-depo.component.css']
})
export class AddDepoComponent implements AfterViewInit {
  depot : Depot
  map: L.Map;
  smallIcon: L.Icon;
  marker: L.Marker;
  public latt: number;
  public long: number;
  public adresse: string;
  addForm: FormGroup;

  constructor(private elementRef: ElementRef, private http: HttpClient, private fb:FormBuilder,private _entrpserv :EntropotService) {
    this.addForm= this.fb.group({
      name: [''],
      longitude: [null],
      lattitude: [null],
      capacite: [null],
      adresse: [''],
    })
  }

  ngAfterViewInit(): void {
    this.createMap();
    this.initializeMarkerIcon();
    this.enableClickToAddMarker();
  }

  addEntropot():void{

    if (this.addForm.invalid){
     
      return console.log("form invalide");
    }
    const formvalue = this.addForm.value;
  this._entrpserv.createEntroopot(formvalue).subscribe((res)=>{
    alert('entropot ajouté');
    console.log('res : ',res);
  },(error)=>{
    console.log("erreur ajout entropot ",error);
  })

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

      this.getAddressFromCoordinates(lat, lng,450).then((address: string) => {
        console.log('Address:', address,' avec long =',this.long," et latt =",this.latt);
        this.adresse=address;
       this.addForm.patchValue({
          adresse: address,
          longitude: this.long,
          lattitude: this.latt
        });
      });
    });
  }

  getAddressFromCoordinates(lat: number, lng: number,radius: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&radius=${radius}`;

    return this.http.get(url)
      .toPromise()
      .then((response: any) => {
        if (response?.address) {
          const { road, city, country,lat,lng } = response.address;
          return `${road}, ${city}, ${country}`;
        }
        return 'Adresse non trouvé';
      })
      .catch(() => 'Adresse non trouvé');
  }
}
