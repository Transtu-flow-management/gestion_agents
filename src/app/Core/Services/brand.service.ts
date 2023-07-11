import { Injectable } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { Brand } from '../interfaces/brand';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private url:string ='/brand' ;

  constructor(private http :HttpClient,private gs:GlobalService) { }
  public createBrand(brand : Brand):Observable<Brand>{
    const curl = this.gs.uri +this.url+'/create';
   return this.http.post<Brand>(curl,brand);
  }
  
  getAllbrands(page: number, size: number): Observable<Brand[]> {
    const gurl = this.gs.uri +this.url ;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Brand[]>(gurl, { params });
  }

  public deletebrand(id:string):Observable<any>{
    const surl =this.gs.uri +this.url+`/${id}`;
    return this.http.delete(surl);
  }
  public updatebrand(id :string,brand){
    const upurl = this.gs.uri +this.url +`/update/${id}`;
    return this.http.put<Brand>(upurl, brand);
  }
  public getAllmakers():Observable<Brand[]>{
    const gmurl = this.gs.uri +this.url +`/fabriquants`;
    return this.http.get<Brand[]>(gmurl);
  }
  
}
