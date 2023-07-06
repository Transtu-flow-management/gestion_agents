import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('expandedState', [
      state('expanded', style({
        backgroundColor: '#001435',
        color: 'white'
      })),
      state('collapsed', style({
        backgroundColor: '#001449',
        color: 'white'
      })),
      
    ])
  ]
})
export class SidebarComponent {
  isExpanded1 = false; 
  isExpanded2 = false; 
  isExpanded3 = false; 
  isExpanded4 = false; 

}
