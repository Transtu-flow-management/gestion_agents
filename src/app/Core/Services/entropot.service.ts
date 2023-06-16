import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Depot } from '../interfaces/depot';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/global.service';
@Injectable({
  providedIn: 'root'
})
export class EntropotService {
  private url:string;

  constructor(private http :HttpClient,private gs:GlobalService) {
     this.url = gs.uri +'/depot/create'
     }

  public createEntroopot(depot : Depot):Observable<Depot>{
   
   return this.http.post<Depot>(this.url,depot);
  }
}
