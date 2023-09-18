import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { loginDTO } from '../../DTO/login';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { GlobalService } from 'src/app/global.service';
import { CookieService } from 'ngx-cookie-service';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private loginurl = 'http://localhost:5300/api/auth';
  private dockerurl = 'http://springcontainer:5300/api/auth'
  private user: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router,private snackBar:MatSnackBar,
    private gs: GlobalService) {
      this.checkAuthentication();
  }
  private checkAuthentication() {
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedIn = !!accessToken; // Check if the access token exists
    this._isLoggedIn$.next(isLoggedIn);
  }
  checkAuthenticationStatus() {
    return this.http.get(`${this.loginurl}/check`, { observe: 'response' });
  }
  setAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }
 
  isAuthenticatedUser() {
    return this.isAuthenticated;
  }
  public authenticate(credentials: loginDTO): Observable<any> {
    const url = `${this.loginurl}/authenticate`;
   
    return this.http.post(url, credentials,{withCredentials:true}).pipe(tap((res:any)=>{
      const accessToken = res.access_token;
      localStorage.setItem('accessToken', accessToken);
      this.isAuthenticated = true;
      this._isLoggedIn$.next(true);
    }));
  
  }
  getAccessToken(): string | null {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken || null;
  }
  setAcessToken(token:string){
    if (this.getAccessToken() !==null){
      window.localStorage.setItem("accessToken",token);
    }else{
      window.localStorage.removeItem("accessToken");
    }
  }
  public logout(): void {
    // Clear tokens from local storage
    localStorage.clear();
    this.isAuthenticated = false;
    this._isLoggedIn$.next(false);
    this.user.next(null);
    // Redirect to the login page
    this.router.navigate(['/signin']);
  }
  public register(agent: any): Observable<any> {
    const url = `${this.loginurl}/register`;
    return this.http.post(url, agent).pipe(
      tap(() => {
       this.openAddToast("User Registered");
      },(error)=>{
        const mees = `Failed to add User${error.status}`
        this.openfailToast(mees);
      }
      )
    );
  }
  openAddToast(message: string) {
    this.snackBar.openFromComponent(SuccessToastComponent, {
      data: { message: message },
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: ['snack-green', 'snack-size', 'snack-position']
    })
  }

  openfailToast(message: string): void {
    this.snackBar.openFromComponent(FailedToastComponent, {
      data: { message: message }, duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "bottom",
      panelClass: ['snack-red', 'snack-size']
    });
  }
  public refreshtoken():Observable<any>{
    return this.http.post(`${this.loginurl}/refresh-token`,{});
  }

  public saveUser(agent: any) {
    const user = agent.agent;
    this.user.next(user);
    localStorage.setItem('agent', JSON.stringify(user));
  }
 public hasAuthority(requiredperm:string):boolean{
    const agentJson = localStorage.getItem('agent');
    const agent = JSON.parse(agentJson);
    const userAuthorities = agent.authorities.map((authority) => authority.authority);
    if (userAuthorities.includes(requiredperm)){
      return true;
    }
    return false;
  }

 public hasAuthorities(requiredAuthorities: string[]): boolean {
    const agentJson = localStorage.getItem('agent');
    const agent = JSON.parse(agentJson);
    const userAuthorities = agent.authorities.map((authority) => authority.authority);
    console.log(userAuthorities);
    console.log(requiredAuthorities);
    for (const requiredAuthority of requiredAuthorities) {
      console.log(requiredAuthority);
      console.log(userAuthorities.includes(requiredAuthority));
      if (!userAuthorities.includes(requiredAuthority)) {
        return false;
      }
    }
  return true;
  }


}