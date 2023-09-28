import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { Reclammation } from '../Models/Reclammation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamService {
  private url:string ='/reclam' ;
  constructor(private http :HttpClient,private gs:GlobalService) { }

  public getReclams(page: number, size: number):Observable<Reclammation[]>{
    const gurl= this.gs.uri + this.url;
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
   
    return this.http.get<Reclammation[]>(gurl,{params});
  }
  public createReclam(reclam : Reclammation):Observable<Reclammation>{
    const curl = this.gs.uri +this.url+'/add';
   return this.http.post<Reclammation>(curl,reclam);
  }
  public sendmail(reclam:Reclammation):Observable<Reclammation>{
    const surl = this.gs.uri+this.url+'/send';
    return this.http.post<Reclammation>(surl,reclam);
  }


}
