import { HttpClient, HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Agent } from '../interfaces/Agent';
import { Observable } from 'rxjs';
import * as shajs from 'sha.js';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private usersUrl ='http://localhost:5300/api/agents';  // URL to web api

  constructor(private http: HttpClient) { 
  }
  getAgent(id: number): Observable<Agent> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<Agent>(url);
  }
  public createAgent(agent : Agent):Observable<Agent>{
    const url = `${this.usersUrl}/create`;
   return this.http.post<Agent>(url,agent);
  }

  public sayHello(){
    return this.http.get<String>('${this.usersUrl}/hello');
  }
  public getAgents(){
    return this.http.get<Agent[]>(this.usersUrl);
  }
 public updateAgent(id:Number,agent) {
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
  public deleteAgent(id:Number):Observable<any>{
    const url =`${this.usersUrl}/delete/${id}`;
    return this.http.delete(url);

  }
  public assignRole(agentid:Number,roleid:Number){
    const url = `${this.usersUrl}/${agentid}/role/${roleid}`;
    return this.http.post<Agent>(url,null)
  }
  public uploadimage(id: Number,imagefile :File){

  }
  public getimage(filename :String):Observable<Blob>{
    
    const url =`${this.usersUrl}/files/${filename}`;
    return this.http.get(url,{ responseType: 'blob' });
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

