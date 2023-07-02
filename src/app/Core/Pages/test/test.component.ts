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

    this.filteredOptions = this.fabriquants.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.condcutors.slice();
      }),
    );
    this._service.getall().subscribe(conductor=> this.condcutors = conductor);
  }
  displayFn(user: Conductor): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): Conductor[] {
    const filterValue = name.toLowerCase();

    return this.condcutors.filter(option => option.name.toLowerCase().includes(filterValue));
  }

}
