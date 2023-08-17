import { HttpClient, HttpErrorResponse,HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Agent } from '../Models/Agent';
import { Observable } from 'rxjs';
import * as shajs from 'sha.js';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private usersUrl ='http://localhost:5300/api/agents';  // URL to web api
  private dockerurl = 'http://springcontainer:5300/api/agents';

  constructor(private http: HttpClient) { 
  }
  getAgent(id: number): Observable<Agent> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<Agent>(url);
  }
  getAgentsPage(page: number, size: number): Observable<Agent[]> {
    const url = `${this.usersUrl}/p`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Agent[]>(url, { params });
  }

  public createAgent(agent : Agent):Observable<Agent>{
    const url = `${this.usersUrl}/create`;
   return this.http.post<Agent>(url,agent);
  }
  public getfilteredDate(date:Date):Observable<Agent[]>{
    const furl = `${this.usersUrl}/datesearch`;
    const params = new HttpParams().set('dateFilter', date.toISOString());
    return this.http.get<Agent[]>(furl,{params});
  }


  public sayHello(){
    return this.http.get<String>('${this.usersUrl}/hello');
  }
 
 public updateAgent(id:number,agent) {
  const url = `${this.usersUrl}/update/${id}`;
    return this.http.put<Agent>(url, agent);
  }
  patchAgent(agentId: number, champs: Map<String, any>): Observable<Agent> {
    const url = `${this.usersUrl}/update/${agentId}`;
    return this.http.patch<Agent>(url, champs);
  }
  patchAgentimg(agentId: number ,formdata: FormData,file? : File): Observable<Agent> {
    if (file){
      formdata.append('image',file,file.name);
    }
    const headers = new HttpHeaders().set('enctype', 'multipart/form-data');

    const url = `${this.usersUrl}/update/${agentId}`;
    return this.http.patch<Agent>(url, formdata,{headers});
  
}
  public deleteAgent(id:number):Observable<any>{
    const url =`${this.usersUrl}/delete/${id}`;
    return this.http.delete(url);

  }
  public assignRole(agentid:number,roleid:Number){
    const url = `${this.usersUrl}/${agentid}/role/${roleid}`;
    return this.http.post<Agent>(url,null)
  }
  public getimage(filename :string):Observable<Blob>{
    
    const url =`${this.usersUrl}/files/${filename}`;
    return this.http.get(url,{ responseType: 'blob' });
  }
  public searchagent(query :String){
    let params = new HttpParams()
    .set('query', query.toString())
    const url = `${this.usersUrl}/search`;
    return this.http.get<Agent[]>(url,{params});
  }

  private handleError(httpError: HttpErrorResponse) {
    if (httpError.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', httpError.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${httpError.status}, ` +
        `body was: ${httpError.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwwError('Something bad happened; please try again later.');
  }
  hashPassword(password: any) {
    return shajs('sha256').update(password).digest('hex');
  }
  

}
function throwwError(arg0: string) {
  throw new Error('Function not implemented.');
}

