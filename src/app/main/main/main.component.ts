import {  Component,OnInit,ViewChild  } from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from 'src/app/Core/Services/auth.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;  
  userDisplayName = '';
  toggleSidenav() {
    this.sidenav.toggle();
  }
  constructor(public authservice : AuthService){}
logout(){
  this.authservice.logout();
}
ngOnInit(): void {  
}
}
