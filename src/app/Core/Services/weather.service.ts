import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/global.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiurl = this.gs.uri;

  constructor(private http:HttpClient,private gs:GlobalService) { }
  
  getWeatherByCoordinates(lat: number, lon: number): Observable<any> {
    const wurl = this.apiurl +`/dashboard/weather`
    const params = new HttpParams()
      .set('lat', `${lat}`)
      .set('lon',`${lon}`);
      return this.http.get(wurl,{params});
  }
  getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

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
