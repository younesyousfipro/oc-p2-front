import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {StudentListComponent} from './pages/students/student-list.component';
import {StudentDetailComponent} from './pages/students/student-detail.component';
import {StudentFormComponent} from './pages/students/student-form.component';
import {authGuard} from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  // task3 - route de l'ecran de login
  {
    path: 'login',
    component: LoginComponent
  },
  // task5 - routes etudiants imbriquees sous un parent sans composant.
  // Le guard porte par le parent s'applique a TOUS les enfants : impossible
  // d'oublier une route, et canActivate n'est ecrit qu'une fois.
  {
    path: 'students',
    canActivate: [authGuard],
    children: [
      { path: '', component: StudentListComponent },
      { path: 'new', component: StudentFormComponent },
      // 'new' doit rester AVANT ':id' : le routeur teste les routes dans l'ordre,
      // et ':id' capturerait sinon l'URL /students/new avec id = "new".
      // Routes de la plus specifique a la plus generale.
      { path: ':id/edit', component: StudentFormComponent },
      { path: ':id', component: StudentDetailComponent }
    ]
  }

];
