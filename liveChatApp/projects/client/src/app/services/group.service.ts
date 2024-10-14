import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private BACKEND_URL = 'http://localhost:8080/groups';

  constructor(private http: HttpClient) { }

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(this.BACKEND_URL);
  }

  getGroupById(id: number): Observable<any> {
    return this.http.get<any>(`${this.BACKEND_URL}/${id}`);
  }

  createGroup(group: any): Observable<any> {
    group.admins = [group.adminId]; 
    return this.http.post<any>(this.BACKEND_URL, group);
  }
  

  updateGroup(id: number, group: any): Observable<any> {
    return this.http.put<any>(`${this.BACKEND_URL}/${id}`, group);
  }

  deleteGroup(groupId: number, adminId: number, isSuperAdmin: boolean): Observable<any> {
    return this.http.delete<any>(`${this.BACKEND_URL}/${groupId}?adminId=${adminId}&isSuperAdmin=${isSuperAdmin}`);
  }

  addUserToGroup(userId: number, groupId: number): Observable<any> {
    return this.http.post(`${this.BACKEND_URL}/${groupId}/add-user`, { userId });
  }
  
  removeUserFromGroup(userId: number, groupId: number): Observable<any> {
    return this.http.post(`${this.BACKEND_URL}/${groupId}/remove-user`, { userId });
  }
  
  addInterestToGroup(groupId: number, userId: number): Observable<any> {
    return this.http.post(`${this.BACKEND_URL}/${groupId}/register-interest`, { userId });
  }
  
  approveUserInterest(groupId: number, userId: number): Observable<any> {
    return this.http.post(`${this.BACKEND_URL}/${groupId}/approve-interest`, { userId });
  }
  
  
}
