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
  constructor(private as: UserServiceService,private carservice:CarService,private cs :ConductorService){

    this.countagents();
  }
ngOnInit(): void {
    this.as.getagetns().subscribe((agetns)=>{
      this.users = agetns;
    })
    this.carservice.findcars().subscribe((cars)=>{
      this.cars = cars;
    })
    this.cs.getallDrivers().subscribe((drv)=>{
      this.driver = drv;
    })
}
countagents(){
  this.numberOfAgents = this.users.length;
}


  }

