import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';

// task5 - ajoute le Bearer token a chaque requete sortante.
//
// Pendant front du filtre Spring : une preoccupation transversale ecrite une fois,
// appliquee a toutes les requetes, au lieu d'etre repetee dans chaque methode de
// StudentService.
//
// Routes exclues : /api/login et /api/register sont publiques cote back, mais si on
// leur envoyait un token expire, le BearerTokenAuthenticationFilter tenterait quand
// meme de le valider et repondrait 401 avant meme d'examiner les regles d'acces.
// Impossible de se reconnecter avec un token perime. D'ou cette liste.
const PUBLIC_URLS = ['/api/login', '/api/register'];

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (PUBLIC_URLS.some(url => request.url.startsWith(url))) {
    return next(request);
  }

  // inject() ne fonctionne qu'ici, au debut de la fonction : c'est le seul endroit
  // ou l'on se trouve dans un contexte d'injection. D'ou la capture des deux
  // dependances avant le pipe, qui s'executera plus tard.
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // HttpRequest est immuable : on ne peut pas ajouter un en-tete a l'objet existant,
  // il faut en produire une copie modifiee.
  const authenticatedRequest = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  // Ce qui suit next() s'execute au RETOUR, quand la reponse remonte.
  // Un 401 signifie ici token expire, absent ou invalide : on nettoie le token mort
  // et on ramene l'utilisateur a l'ecran de connexion, au lieu de le laisser devant
  // un message d'erreur incomprehensible.
  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
