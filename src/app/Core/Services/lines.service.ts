import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/global.service';
import { Lines } from '../interfaces/Lines';

@Injectable({
  providedIn: 'root'
})
export class LinesService {
  private url:string ='/lines' ;
  constructor(private http : HttpClient,private gs:GlobalService) { }


  public getlines(page: number, size: number):Observable<Lines[]>{
    const gurl= this.gs.uri + this.url;
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
   
    return this.http.get<Lines[]>(gurl,{params});
  }
  public getfilteredDate(date:Date):Observable<Lines[]>{
    const furl = this.gs.uri +this.url +`/datesearch`;
    const params = new HttpParams().set('dateFilter', date.toISOString());
    return this.http.get<Lines[]>(furl,{params});
  }

  public deleteline(id:string):Observable<any>{
    const durl = this.gs.uri +this.url + `/${id}`;
    return this.http.delete(durl);
  }
  public addline(lines:Lines):Observable<Lines>{

    const aurl= this.gs.uri + this.url +`/add`;
    return this.http.post<Lines>(aurl,lines);

  }
  public updateline(id:string,lines:Lines):Observable<Lines>{
    const updurl = this.gs.uri +this.url +`/update/${id}`;
    return this.http.put<Lines>(updurl,lines);
  }
}
