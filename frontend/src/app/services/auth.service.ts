import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';

//import { environment } from '@environments/environment';
//import { User } from '../../../srv/models/User';

export interface UserDetails {
    _id: string;
    firstName: string;
    lastName: string;
    age: number;
    family: string;
    race: string;
    food: string;
    email: string;
    exp: number;
    iat: number;
}

interface TokenResponse {
    token: string;
}

export interface TokenPayload {
    firstName?: string;
    lastName?: string;
    age?: number;
    family?: string;
    race?: string;
    food?: string;
    email: string;
    password: string;
}

@Injectable()
export class AuthService {
    private token: string = '';
    baseUrl: string = 'http://localhost:3000/api';
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private http: HttpClient, private router: Router){

    }

    private saveToken(token: string): void {
        localStorage.setItem('mean-token', token);
        this.token = token;
    }

    private getToken(): string {
        if (!this.token) {
          this.token = JSON.parse(localStorage.getItem('mean-token')!);
        }
        return this.token;
    }

    public getUserDetails(): UserDetails | null {
        const token = this.getToken();
        let payload;
        if (token) {
          payload = token.split('.')[1];
          payload = window.atob(payload);
          return JSON.parse(payload);
        } else {
          return null;
        }
    }

    public isLoggedIn(): boolean {
        const user = this.getUserDetails();
        if (user) {
          return user.exp > Date.now() / 1000;
        } else {
          return false;
        }
    }

    private request(method: 'post'|'get'|'put', type: 'login'|'register'|'info'|'update'|'getOne', user?: TokenPayload): Observable<any> {
      let base;

      if (method === 'post') {
        base = this.http.post<TokenResponse>(`/api/${type}`, user);
      } else {
        base = this.http.get<TokenResponse>(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
      }
    
      const request = base.pipe(
        map((data: TokenResponse) => {
          if (data.token) {
            this.saveToken(data.token);
          }
          return data;
        })
      );
    
      return request;
      }

    public register(user: TokenPayload): Observable<any> {
        return this.request('post', 'register', user);
    }

    public login(user: TokenPayload): Observable<any> {
        return this.request('post', 'login', user);
    }

    public logout(): void {
        this.token = '';
        window.localStorage.removeItem('mean-token');
        this.router.navigateByUrl('/');
    }

    public info(): Observable<any> {
      return this.request('get', 'info');
    }
    public update(user: TokenPayload): Observable<any> {
      return this.request('put', 'update', user);
    }

    public getUserById(id: number): Observable<any> {
      return this.request('get', 'getOne')
    }
}