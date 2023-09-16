import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('accessToken');
    let cloned = req;
    if (token) {
      cloned = req.clone({
        headers: req.headers.append('Authorization', 'Bearer ' + token),
      });
    }
    return next.handle(cloned);
  }

}
