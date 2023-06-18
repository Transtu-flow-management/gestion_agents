import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Depot } from '../interfaces/depot';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/global.service';
@Injectable({
  providedIn: 'root'
})
export class EntropotService {
  private url:string ='/depot' ;

  constructor(private http :HttpClient,private gs:GlobalService) {
     }

  public createEntroopot(depot : Depot):Observable<Depot>{
    const curl = this.gs.uri +this.url+'/create';
   return this.http.post<Depot>(curl,depot);
  }
  public getAllentrp(){
    const gurl = this.gs.uri +this.url ;
    return this.http.get<Depot[]>(gurl);
  }
  public deleteEntrp(id:Number):Observable<any>{
    const surl =this.gs.uri +this.url+`/${id}`;
    return this.http.delete(surl);
  }
}
