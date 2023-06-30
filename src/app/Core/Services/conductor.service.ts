import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/global.service';
import { Conductor } from '../interfaces/Conductor';

@Injectable({
  providedIn: 'root'
})
export class ConductorService {
  private url:string ='/conductors' ;
  constructor(private http : HttpClient,private gs:GlobalService) { }


  public getconductors(page: number, size: number,filter?:Date):Observable<Conductor[]>{
    const gurl= this.gs.uri + this.url;
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
    if (filter!=null){
      params = params.set('filter',filter.toISOString());
    }
    return this.http.get<Conductor[]>(gurl,{params});
  }

  public deleteConductor(id:number):Observable<any>{
    const durl = this.gs.uri +this.url + `/${id}`;
    return this.http.delete(durl);
  }
}
