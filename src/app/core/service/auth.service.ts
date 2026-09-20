import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Login } from '../models/Login';
import { LoginResponse } from '../models/LoginResponse';

// task3 - service dedie a l'authentification.
// Separe de UserService (qui porte l'inscription) : il appelle /api/login et il est
// le seul endroit qui sait ou le token est range.
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly TOKEN_KEY = 'token';

  constructor(private httpClient: HttpClient) { }

  login(credentials: Login): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/api/login', credentials)
      // tap observe la reponse au passage pour ranger le token, sans la modifier :
      // le composant recoit la meme LoginResponse et n'a pas a s'en occuper.
      .pipe(tap(response => this.saveToken(response.token)));
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  private saveToken(token: string): void {
    localStorage.setItem(AuthService.TOKEN_KEY, token);
  }
}
