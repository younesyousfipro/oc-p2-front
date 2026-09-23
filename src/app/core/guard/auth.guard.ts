import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

// task5 - garde les routes etudiants : seul un agent connecte peut les activer.
//
// S'execute AVANT que le composant ne soit cree. Retourner true laisse passer,
// retourner un UrlTree redirige.
//
// Ce n'est PAS une securite : le guard ne fait que verifier la presence d'un token
// dans le navigateur, sans pouvoir juger de sa validite. La vraie barriere est le
// back, qui verifie la signature. Le guard evite simplement d'afficher un ecran
// vide qui echouerait ensuite en 401.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
