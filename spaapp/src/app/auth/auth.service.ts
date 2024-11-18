import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  private expiryTimer: any;

  private isAuthenticate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  isAuthenticated$ = this.isAuthenticate.asObservable();

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {email, password}).pipe(
      tap((response: any)=> {
        this.isAuthenticate.next(true);
        localStorage.setItem('token', response.token);
        this.expiryTimer = setInterval(() => { this.checkExpiry(); }, 60000);
      })
    )
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private checkExpiry(){
    const token = localStorage.getItem('token');
    if(!token) return;
    const expiryDate = new Date(parseInt(token.split('.')[1], 16) * 1000);
    if(expiryDate <= new Date()) {
      clearInterval(this.expiryTimer)
      this.logout();
    }
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {email, password});
  }

  logout(): void {
    this.isAuthenticate.next(false);
    localStorage.removeItem('token');
  }

  isLogged(){
    return !!localStorage.getItem('token');
  }
}
