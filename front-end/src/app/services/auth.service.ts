import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  setSession(user: any, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  register(userData: any): Observable<any> {
    return this.http.post(ENDPOINTS.AUTH.REGISTER, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(ENDPOINTS.AUTH.LOGIN, credentials);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null); // This notifies the Header to hide the name
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}
