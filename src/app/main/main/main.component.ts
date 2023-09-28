import {  Component,OnInit,ViewChild  } from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
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
  userPicture : String='http://localhost:5300/api/agents/img/';
  userinfo: any;
  toggleSidenav() {
    this.sidenav.toggle();
  }
  constructor(public authservice : AuthService,private gs:GlobalService,private router:Router){}
logout(){
  this.authservice.logout();
}
ngOnInit(): void {  
  this.userinfo = this.gs.getUserDetails();
  this.userPicture = this.userPicture + this.userinfo.imageUrl;
  if (this.userinfo.imageUrl ==='NO_FILE_PROVIDED'){
    this.userPicture =''
  }
  console.log(this.userPicture)
}

openSettings() {
  this.router.navigate(['add'])
 }
}
