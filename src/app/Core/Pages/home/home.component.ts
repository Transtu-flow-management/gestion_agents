import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup , Validators } from '@angular/forms';
import { UserServiceService } from '../../Services/user-service.service';
import { Agent } from '../../Models/Agent';
import { CarService } from '../../Services/car.service';
import { Car } from '../../Models/Car';
import { ConductorService } from '../../Services/conductor.service';
import { ca } from 'date-fns/locale';
import { Conductor } from '../../Models/Conductor';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
   userPicture : String=''
users : Agent[]=[];
cars : Car[] = [];
driver : Conductor[]=[];
numberOfAgents :number;
enmacrche : number;
enpanne : number;
  userinfo: any;
  constructor(private as: UserServiceService,private carservice:CarService,private cs :ConductorService){
    this.countagents();
    this.countCars();
  }
ngOnInit(): void {
this.countDrivers();
}
countDrivers(){
  this.cs.getallDrivers().subscribe((drv)=>{
    this.driver = drv;
    this.numberOfAgents = drv.length;
  
  })

}
countagents(){
  this.as.getagetns().subscribe((agetns)=>{
    this.users = agetns; 
  })
}
countCars(){
  this.carservice.findcars().subscribe((cars)=>{
    this.cars = cars;
    this.enmacrche = (this.cars.filter((c)=> c.state.name ==='marche').length /this.cars.filter((c)=> c.state).length)*100
    this.enpanne = (this.cars.filter((c)=> c.state.name ==='en panne').length/this.cars.filter((c)=> c.state).length)*100
  })
}

  }

