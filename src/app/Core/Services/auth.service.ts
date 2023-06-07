import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';
import { loginDTO } from '../../DTO/login';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Agent } from '../interfaces/Agent';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginurl = 'http://localhost:5300/api/auth';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Check the initial authentication status on service initialization
    this.checkAuthenticationStatus();
  }

  private checkAuthenticationStatus() {
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedIn = !!accessToken; // Check if the access token exists
    this._isLoggedIn$.next(isLoggedIn);
  }

  public authenticate(credentials: loginDTO): Observable<any> {
    const url = `${this.loginurl}/authenticate`;
    return this.http.post(url, credentials).pipe(
      tap((response: any) => {
        const accessToken = response.access_token;
        const refreshToken = response.refresh_token;
        // Save tokens in local storage or cookies
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        // Update the authentication status
        this._isLoggedIn$.next(true);
      })
    );
  }

  public logout(): void {
    // Clear tokens from local storage or cookies
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Update the authentication status
    this._isLoggedIn$.next(false);
    // Redirect to the login page or any other desired route
    this.router.navigate(['/signin']);
  }

  public register(agent : any): Observable<any>{
   const url = `${this.loginurl}/register`;
   return this.http.post(url,agent).pipe(
    tap((response:any)=>{
      console.log("user registered");
    }
    )
   )
  }
}