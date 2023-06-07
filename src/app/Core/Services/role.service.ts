import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPermissions, Role } from '../interfaces/Role';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private roleselect : Role;
  private roleurl ='http://localhost:5300/api/roles';
  constructor(private http:HttpClient) { }
  setroleselect(role: Role): void {
    this.roleselect = role;
  }
  getRole():Role {
    return this.roleselect;
  }
  public createRole(role : Role):Observable<Role>{
    const url = `${this.roleurl}/add`;
   return this.http.post<Role>(url,role);
  }

  public getRoles(){
    return this.http.get<Role[]>(this.roleurl);
  }
 public updateRole(id:Number,role: Role):Observable<Role>{
  const url = `${this.roleurl}/update/${id}`;
    return this.http.put<Role>(url, role);
  }
  public deleteRole(id:Number):Observable<any>{
    const url =`${this.roleurl}/delete/${id}`;
    return this.http.delete(url);
  }
  public AssignPermssionsToRole(id:Number,permissions : String[]):Observable<IPermissions>{
    const url = `${this.roleurl}/${id}/permissions`;
    return this.http.post<any>(url,permissions);
  }
}
