import { HttpClient } from '@angular/common/http';
import { Injectable,Inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permurl ='http://localhost:5300/api';
  
  constructor(private http : HttpClient) { }


public fetchpermissions():Observable<any>{
return this.http.get<String[]>(`${this.permurl}/permissions`);
}

}
