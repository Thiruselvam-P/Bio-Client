import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://bio-backend-6agg.onrender.com';
  private apiUrl = `${this.baseUrl}/auth`;
  private userUrl = `${this.baseUrl}/users`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(savedUser ? JSON.parse(savedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'ADMIN';
  }

  getUserName(): string | null {
    return this.currentUserValue?.name || null;
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.userUrl}/${userId}`);
  }

  updateUser(userId: string, updateData: any): Observable<any> {
    return this.http.patch(`${this.userUrl}/${userId}`, updateData);
  }

  toggleUserBlock(userId: string, isActive: boolean): Observable<any> {
    return this.updateUser(userId, { isActive });
  }
}
