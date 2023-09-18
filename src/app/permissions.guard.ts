import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './Core/Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate {
  constructor(private authService:AuthService,private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
   

      if (this.authService.hasAuthorities(route.data['authorities'])) {
        return true; 
      } else {
        this.router.navigate(['/access-denied']);
        return false; 
      }
    }
  }
