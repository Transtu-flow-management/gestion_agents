import { Component } from '@angular/core';
import { Depot } from '../../interfaces/depot';

@Component({
  selector: 'app-entropot',
  templateUrl: './entropot.component.html',
  styleUrls: ['./entropot.component.css']
})
export class EntropotComponent {
depots : Depot[] =[];
}
