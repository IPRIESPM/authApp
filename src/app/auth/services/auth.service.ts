import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { AuthStatus, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl:string = environment.baseUrl;
  private httpClient = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  currentUser = computed(() => this._currentUser());
  authStatus = computed(() => this._authStatus());

  constructor() { }

  login(email:string, password:string):Observable<boolean>{
    const url = `${this.baseUrl}/auth/login`;
    const body = {
      email,
      password
    }
    return this.httpClient.post<LoginResponse>(url,body)
    .pipe(
      tap( ({user, token})=>{
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);

      }),
      map(()=>true),
      catchError( err => {
        return throwError(() => err.error.message);
      })
    )
  }
}
