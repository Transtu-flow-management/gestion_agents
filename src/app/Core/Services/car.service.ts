import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/global.service';
import { Car } from '../Models/Car';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private url:string ='/cars' ;
  constructor(private http : HttpClient,private gs:GlobalService) { }

  
  public getCars(page: number, size: number):Observable<Car[]>{
    const gurl= this.gs.uri + this.url;
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
   
    return this.http.get<Car[]>(gurl,{params});
  }
  public addcar(car:Car):Observable<Car>{
    const aurl= this.gs.uri + this.url +`/add`;
    return this.http.post<Car>(aurl,car);
  }
  public deletecar(id:string):Observable<any>{
    const durl = this.gs.uri +this.url + `/${id}`;
    return this.http.delete(durl);
  }

public updatecar(id:string,car:Car):Observable<Car>{
  const uurl = this.gs.uri +this.url +`/update/${id}`;
  return this.http.put<Car>(uurl,car);
}



  //for angular material autocomplete
  public retreivelines():Observable<any>{
    //const rsurl =`http://localhost:5300/api/resx`
    const rsurl = this.gs.uri +`/lines/all`
    return this.http.get<String[]>(rsurl);
  }
  public retreiveConditions():Observable<any>{
    //const rsurl =`http://localhost:5300/api/resx`
    const csurl = this.gs.uri +`/conditions/all`
    return this.http.get<String[]>(csurl);
  }
  public retreivePaths():Observable<any>{
    //const rsurl =`http://localhost:5300/api/resx`
    const csurl = this.gs.uri +`/paths/all`
    return this.http.get<String[]>(csurl);
  }
  public retreivebrands():Observable<any>{
    //const rsurl =`http://localhost:5300/api/resx`
    const csurl = this.gs.uri +`/brand/all`
    return this.http.get<String[]>(csurl);
  }
}
