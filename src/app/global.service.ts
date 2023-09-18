import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Agent } from './Core/Models/Agent';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private user: BehaviorSubject<any>;
  public  agentPerm : any; 
  constructor(private injector: Injector) { }
  uri = 'http://localhost:5300/api'
  
  public get router(): Router {
    return this.injector.get(Router);
  }
  public getUserDetails():string{
    const agent = localStorage.getItem("agent");
     this.agentPerm = JSON.parse(agent);
     return this.agentPerm;
      }
  getUser(): Observable<any> {
    return this.user.asObservable();
  }
  setUser(user: any) {
    this.user.next(user);
  }
}
