import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/global.service';
import { Condition } from '../Models/condition';

@Injectable({
  providedIn: 'root'
})
export class ConditionService {
  private url:string ='/conditions' ;
  constructor(private http: HttpClient,private gs:GlobalService) { }

  public createCondition(condition : Condition):Observable<Condition>{
    const curl = this.gs.uri +this.url+'/add';
   return this.http.post<any>(curl,condition);
  }
  public getAllConditions(page:number,pagesize:number):Observable<Condition[]>{
    const gurl = this.gs.uri +this.url ;
    let params = new HttpParams()
    .set('page',page.toString())
    .set('size',pagesize.toString())
    return this.http.get<Condition[]>(gurl,{params});
  }
  public deleteCondition(id:string):Observable<any>{
    const surl =this.gs.uri +this.url+`/${id}`;
    return this.http.delete(surl);
  }
  public updateCondition(id :string,condition : Condition){
    const upurl = this.gs.uri +this.url +`/update/${id}`;
    return this.http.put<any>(upurl, condition);
  }
}
