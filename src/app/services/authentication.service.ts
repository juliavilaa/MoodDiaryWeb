import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';
import { Jwtres } from '../models/jwtres';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiUri = '/api';
  authSubject = new BehaviorSubject(false);
  private token: string | null = '';

  constructor(private httpClient: HttpClient) { }

  register(user: User): Observable<Jwtres> {
    return this.httpClient.post<Jwtres>(this.apiUri + '/signup', user);
  }

  login(user: User): Observable<Jwtres> {
    return this.httpClient.post<Jwtres>(this.apiUri + '/login', user).pipe(
      tap((res: Jwtres) => {
        if (res) {
          {
            //console.log(JSON.parse(JSON.stringify(res)).accessToken)
            //ACCESS_TOKEN: JSON.parse(JSON.stringify(res)).accessToken
          }
        } else {
          console.log('hubo un error')
        }
      })

    )
  }


  logout() {
    this.token = '';
    localStorage.removeItem("accessToken");
    localStorage.removeItem("EXPIRES_IN");
  }

  private saveToken(token: string, expiresIn: string) {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("EXPIRES_IN", token);
    this.token = token;
  }

  private getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("accessToken");
    }
    return this.token;
  }
}
