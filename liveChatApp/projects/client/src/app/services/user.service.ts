import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';

const BACKEND_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${BACKEND_URL}/users`);
  }

  getUserGroups(userId: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${BACKEND_URL}/users/${userId}/groups`);
  }
  

  register(user: User): Observable<User> {
    return this.http.post<User>(`${BACKEND_URL}/register`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${BACKEND_URL}/users/${user.id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${BACKEND_URL}/users/${id}`);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${BACKEND_URL}/login`, { username, password });
  }

}

