import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/global.service';
import { Stop } from '../Models/Stop';
import { Path } from '../Models/Path';

@Injectable({
  providedIn: 'root'
})
export class StopserviceService {

  private url:string ='/stops' ;
  constructor(private http : HttpClient,private gs:GlobalService) { }

  public getstops():Observable<Stop[]>{
    const gurl= this.gs.uri + this.url;
    return this.http.get<Stop[]>(gurl);
  }

  public deletestop(id:string):Observable<any>{
    const durl = this.gs.uri +this.url + `/${id}`;
    return this.http.delete(durl);
  }
  public addstop(paths:Stop):Observable<Stop>{

    const aurl= this.gs.uri + this.url +`/add`;
    return this.http.post<Stop>(aurl,paths);

  }
  public updatepstop(paths:Stop,id:string):Observable<Stop>{
    const updurl = this.gs.uri +this.url +`/update/${id}`;
    return this.http.put<Stop>(updurl,paths);
  }
  public getallpaths():Observable<Path[]>{
    const gurl = this.gs.uri+`/paths/all`;
    return this.http.get<Path[]>(gurl);
  }

  
}
