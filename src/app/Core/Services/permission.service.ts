import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permurl ='http://localhost:5300/api/permissions';
  constructor(private http : HttpClient) { }


public fetchpermissions():Observable<any>{
return this.http.get<String[]>(this.permurl);
}

}
