import { AfterViewInit, Component,ElementRef,ViewChild  } from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './Core/Services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent   {
  title = 'transtu';
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;  

  toggleSidenav() {
    this.sidenav.toggle();
  }
  constructor(public authservice : AuthService){}
logout(){
  this.authservice.logout();
}
userPicture : String=''
}
