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

chartOptions = {
  title: {
    text: "Nombre de marques de vehicules"
  },
  animationEnabled: true,
  axisY: {
  includeZero: true
  },
  data: [{
  type: "column", //change type to bar, line, area, pie, etc
  indexLabel: "{y}", //Shows y value on all Data Points
  indexLabelFontColor: "#5A5757",
  dataPoints: [
    { x: 10, y: 71 ,indexLabel:"MAN"},
    { x: 20, y: 55 ,indexLabel:"Reneault"},
    { x: 30, y: 50 ,indexLabel:"Peugeot" },
    { x: 40, y: 65 ,indexLabel:"DACIA"},
    { x: 50, y: 71 },
    { x: 60, y: 92, indexLabel: "Volvo Highest\u2191" },
    { x: 70, y: 68 },
    { x: 80, y: 38, indexLabel: "MERCEDES Lowest\u2193"  },
    { x: 90, y: 54 },
    { x: 100, y: 60 }
  ]
  }]
}
chartOptionsPie = {
  animationEnabled: true,
  theme: "dark2",
  exportEnabled: true,
  title: {
  text: "Véhicule avec le plus de pannes"
  },
  subtitles: [{
  text: "Median hours/week"
  }],
  data: [{
  type: "pie", //change type to column, line, area, doughnut, etc
  indexLabel: "{name}: {y}%",
  dataPoints: [
    { name: "MAN", y: 9.1 },
    { name: "Mercedes", y: 3.7 },
    { name: "Renault", y: 36.4 },
    { name: "Volvo", y: 30.7 },
    { name: "Peugeot", y: 20.1 }
  ]
  }]
}

  }

