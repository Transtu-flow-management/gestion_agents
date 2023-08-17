import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Depot } from '../Models/depot';
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
  public deleteEntrp(id: number, confirmDelete?: boolean): Observable<any> {
    const surl = this.gs.uri + this.url + `/${id}`;
    const params = { confirmDelete: confirmDelete ? 'true' : 'false' };
    const options = { params };
    return this.http.delete(surl, options);
  }
  public updateEntropot(id :Number,depot){
    const upurl = this.gs.uri +this.url +`/update/${id}`;
    return this.http.put<Depot>(upurl, depot);
  }
  public retreiveReseaux():Observable<any>{
    //const rsurl =`http://localhost:5300/api/resx`
    const rsurl = this.gs.uri +`/resx`
    return this.http.get<String[]>(rsurl);
  }
 
  public assigntoDep (id:Number,reseau :String):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.gs.uri}${this.url}/${id}/assignRes`,JSON.stringify(reseau),{headers});

  }
}
