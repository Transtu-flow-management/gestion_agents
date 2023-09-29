import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../Services/weather.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  public latitude: number;
 public longitude: number ;
 public Address :string;
  weatherData: any;
  constructor(
    private weatherService: WeatherService
  ) {   
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((pos)=>{
      console.log(pos);
      this.weatherData = pos;
      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;

      this.weatherService.getWeatherByCoordinates(this.latitude,this.longitude).subscribe((res)=>{
        console.log(res);
      },(err)=>{
        console.log(err);
        console.log(this.latitude,this.longitude);
      });
      this.weatherService.getAddressFromCoordinates(this.latitude,this.longitude).then((address:string)=>{
        this.Address = address;
        console.log(this.Address);

      })

    }); 
  }
  
}
