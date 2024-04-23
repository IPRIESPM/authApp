import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { AuthStatus, LoginResponse, User } from '../interfaces';
import { CheckTokenResponse } from '../interfaces/check-token.response';

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

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user:User, token:string):boolean{
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true;
  }

  login(email:string, password:string):Observable<boolean>{
    const url = `${this.baseUrl}/auth/login`;
    const body = {
      email,
      password
    }
    return this.httpClient.post<LoginResponse>(url,body)
    .pipe(
      map(({user, token}) => this.setAuthentication(user, token)),
      catchError( err => throwError(() => err.error.message))
    )
  }

  checkAuthStatus():Observable<boolean>{
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem("token");

    if(!token) return of(false);

    const headers = new HttpHeaders()
    .set("Authorization",`Bearer ${token}`);

    return this.httpClient.get<CheckTokenResponse>(url,{headers}).pipe(
      map(({user,token})=>{
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token',token);
        return true;
      }),
      catchError(()=>{
        this._currentUser.set(null);
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }
}
