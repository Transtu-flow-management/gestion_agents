import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Role } from '../../interfaces/Role';
import { Conductor } from '../../interfaces/Conductor';
import { ConductorService } from '../../Services/conductor.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{
  fabriquants = new FormControl< Conductor>(null);
  condcutors : Conductor[] =[];
  filteredOptions :Observable<Conductor[]>
  constructor(private _service : ConductorService){}
  
  ngOnInit(): void {

  }
}
