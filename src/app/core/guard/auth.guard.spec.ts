import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot, UrlTree } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../service/auth.service';

// task-tests - tests unitaires du guard de routes.
//
// Aucun HTTP ici : le guard ne fait que lire le token via AuthService et decider.
// AuthService est remplace par un objet minimal, le Router reste le vrai pour que
// createUrlTree produise un UrlTree exploitable.
describe('authGuard', () => {
  const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.charge.signature';

  // authGuard est une fonction et non une classe : elle doit s'executer dans un
  // contexte d'injection pour que ses appels a inject() trouvent leurs dependances.
  // Ses deux parametres ne sont pas utilises par le guard, d'ou les objets vides.
  const executeGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

  const configureWithToken = (token: string | null) => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { getToken: () => token } },
      ],
    });
  };

  it('laisse passer un agent connecte', () => {
    configureWithToken(TOKEN);

    expect(executeGuard()).toBe(true);
  });

  it('redirige vers /login quand aucun token n est stocke', () => {
    configureWithToken(null);

    const result = executeGuard() as UrlTree;

    expect(result.toString()).toBe('/login');
  });
});
