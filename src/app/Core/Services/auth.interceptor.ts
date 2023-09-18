import { Injectable, Injector } from '@angular/core';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
ctr =0;
resStatus :number;
private isRefreshing = false;
  constructor(private authService:AuthService,private inject:Injector)  {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
      const token = this.authService.getAccessToken();
      if (token){
      req = req.clone({

        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      }
      return next.handle(req).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401 || err.status === 500) {
            this.authService.logout();
          } 
          return throwError(err);
        })
      );
      }
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.authService.isLoggedIn$) {
        return this.authService.refreshtoken().pipe(
          switchMap(() => {
            this.isRefreshing = false;

            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;
              console.log("from interceptor:",error.status)
           

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }
}
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];