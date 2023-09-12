import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/global.service';
import { Lines } from '../Models/Lines';
import { Path } from '../Models/Path';

@Injectable({
  providedIn: 'root'
})
export class PathService {

  private url:string ='/paths' ;
  constructor(private http : HttpClient,private gs:GlobalService) { }

  public getpaths(page: number, size: number):Observable<Path[]>{
    const gurl= this.gs.uri + this.url;
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
   
    return this.http.get<Path[]>(gurl,{params});
  }

  public deletepath(id:string):Observable<any>{
    const durl = this.gs.uri +this.url + `/${id}`;
    return this.http.delete(durl);
  }
  public addpath(paths:Path):Observable<Path>{

    const aurl= this.gs.uri + this.url +`/add`;
    return this.http.post<Path>(aurl,paths);

  }
  public updatepaths(paths:Path,id:string):Observable<Path>{
    const updurl = this.gs.uri +this.url +`/update/${id}`;
    return this.http.put<Path>(updurl,paths);
  }
  public retreivelines():Observable<any>{
    //const rsurl =`http://localhost:5300/api/resx`
    const rsurl = this.gs.uri +`/lines/all`
    return this.http.get<String[]>(rsurl);
  }
}
