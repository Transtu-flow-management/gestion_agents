import {  Component,OnInit,ViewChild  } from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { GlobalService } from 'src/app/global.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;  
  userDisplayName = '';
  userPicture : String='';
  userinfo: any;
  toggleSidenav() {
    this.sidenav.toggle();
  }
  constructor(public authservice : AuthService,private gs:GlobalService){}
logout(){
  this.authservice.logout();
}
ngOnInit(): void {  
  this.userinfo = this.gs.getUserDetails();
}
}
