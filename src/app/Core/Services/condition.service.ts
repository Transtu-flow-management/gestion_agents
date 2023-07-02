import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/global.service';

@Injectable({
  providedIn: 'root'
})
export class ConditionService {
  private url:string ='/conditions' ;
  constructor(private http: HttpClient,private gs:GlobalService) { }

  public createEntroopot(depot : any):Observable<any>{
    const curl = this.gs.uri +this.url+'/create';
   return this.http.post<any>(curl,depot);
  }
  public getAllentrp(){
    const gurl = this.gs.uri +this.url ;
    return this.http.get<any[]>(gurl);
  }
  public deleteEntrp(id:string):Observable<any>{
    const surl =this.gs.uri +this.url+`/${id}`;
    return this.http.delete(surl);
  }
  public updateEntropot(id :string,depot){
    const upurl = this.gs.uri +this.url +`/update/${id}`;
    return this.http.put<any>(upurl, depot);
  }
}
