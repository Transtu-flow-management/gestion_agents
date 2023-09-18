import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../Core/Services/auth.service';

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
  constructor(private authserv:AuthService){}
  isExpanded1 = false; 
  isExpanded2 = false; 
  isExpanded3 = false; 
  isExpanded4 = false; 
  hasAuthority(auth:string):boolean{
    if(this.authserv.hasAuthority(auth)){
      return true;
    }
    return false;
  }
}
