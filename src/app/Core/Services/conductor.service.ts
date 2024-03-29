import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/global.service';
import { Conductor } from '../Models/Conductor';

@Injectable({
  providedIn: 'root'
})
export class ConductorService {
  private url:string ='/conductors' ;
  constructor(private http : HttpClient,private gs:GlobalService) { }


  public getconductors(page: number, size: number,agentId:number):Observable<Conductor[]>{
    const gurl= this.gs.uri + this.url;
    let params = new HttpParams()
    .set('agentId',agentId)
    .set('page', page.toString())
    .set('size', size.toString());
   
    return this.http.get<Conductor[]>(gurl,{params});
  }
  public getfilteredDate(date:Date):Observable<Conductor[]>{
    const furl = this.gs.uri +this.url +`/datesearch`;
    const params = new HttpParams().set('dateFilter', date.toISOString());
    return this.http.get<Conductor[]>(furl,{params});
  }

  public deleteConductor(id:number):Observable<any>{
    const durl = this.gs.uri +this.url + `/${id}`;
    return this.http.delete(durl);
  }
  public addconductor(conductor:Conductor):Observable<Conductor>{

    const aurl= this.gs.uri + this.url +`/add`;
    return this.http.post<Conductor>(aurl,conductor);

  }
  public searchagent(query :String){
    let params = new HttpParams()
    .set('query', query.toString())
    const url =  this.gs.uri +this.url+`/search`;
    return this.http.get<Conductor[]>(url,{params});
  }
  public updateconductor(id:number,conductor:Conductor):Observable<Conductor>{
    const updurl = this.gs.uri +this.url +`/update/${id}`;
    return this.http.put<Conductor>(updurl,conductor);
  }
  public getallDrivers():Observable<Conductor[]>{
    const getall = this.gs.uri + this.url +`/all`;
    return this.http.get<Conductor[]>(getall);
  }
  public getconductorsSorted(page: number, size: number,agentId:number):Observable<Conductor[]>{
    const gurl= this.gs.uri + this.url+`/sorted`;
    let params = new HttpParams()
    .set('agentId',agentId)
    .set('page', page.toString())
    .set('size', size.toString());
   
    return this.http.get<Conductor[]>(gurl,{params});
  }
}
