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
  userinfo: any;
  constructor(private as: UserServiceService,private carservice:CarService,private cs :ConductorService,private gs:GlobalService){
    this.countagents();
    this.countCars();
  }
ngOnInit(): void {

  this.userinfo = this.gs.getUserDetails();
  console.log(this.userinfo)
}
countDrivers(){
  this.cs.getallDrivers().subscribe((drv)=>{
    this.driver = drv;
  })

}
countagents(){
  this.as.getagetns().subscribe((agetns)=>{
    this.users = agetns;
    this.numberOfAgents = agetns.length;    
  })
}
countCars(){
  this.carservice.findcars().subscribe((cars)=>{
    this.cars = cars;
    console.log(this.cars)
  })
}

  }

