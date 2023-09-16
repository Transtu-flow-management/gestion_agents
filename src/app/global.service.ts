import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private user: BehaviorSubject<any>;

  constructor(private injector: Injector) { }
  uri = 'http://localhost:5300/api'
  
  public get router(): Router {
    return this.injector.get(Router);
  }

  getUser(): Observable<any> {
    return this.user.asObservable();
  }
  setUser(user: any) {
    this.user.next(user);
  }
}
