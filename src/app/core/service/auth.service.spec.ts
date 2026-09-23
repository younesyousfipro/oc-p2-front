import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { Login } from '../models/Login';
import { LoginResponse } from '../models/LoginResponse';

// task-tests - tests unitaires du service d'authentification.
//
// Meme montage que StudentService, avec une difference : AuthService est le seul
// endroit qui sait ou le token est range. Les trois tests portent donc autant sur
// l'appel HTTP que sur ce qu'il advient du token.
describe('AuthService', () => {
  const URL = '/api/login';
  const TOKEN_KEY = 'token';
  const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.charge.signature';
  const credentials: Login = { login: 'agent', password: 'password' };

  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    // localStorage survit d'un test a l'autre : on repart d'un stockage vide.
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('login appelle POST /api/login et range le token', () => {
    let result: LoginResponse | undefined;
    service.login(credentials).subscribe(response => (result = response));

    const request = httpMock.expectOne(URL);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(credentials);
    request.flush({ token: TOKEN });

    // Le tap range le token au passage sans modifier la reponse : le composant
    // recoit bien la LoginResponse complete.
    expect(result).toEqual({ token: TOKEN });
    expect(localStorage.getItem(TOKEN_KEY)).toBe(TOKEN);
  });

  it('getToken retourne le token stocke', () => {
    localStorage.setItem(TOKEN_KEY, TOKEN);

    expect(service.getToken()).toBe(TOKEN);
  });

  it('logout retire le token du stockage', () => {
    localStorage.setItem(TOKEN_KEY, TOKEN);

    service.logout();

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});
