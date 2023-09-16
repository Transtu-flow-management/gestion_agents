import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpinnerService } from '../Services/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private spinner : SpinnerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
   
   this.spinner.requestStarted();
   
   
    return next.handle(request);
  }
}
