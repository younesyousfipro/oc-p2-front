import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../core/service/auth.service';

// task-tests - premier composant a formulaire reactif. detectChanges est appele des
// le beforeEach : ngOnInit construit le formulaire, dont tous les tests ont besoin.
describe('LoginComponent', () => {
  const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.charge.signature';
  const CREDENTIALS = { login: 'agent', password: 'password' };

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: { login: jest.Mock };
  let router: Router;

  beforeEach(async () => {
    authService = { login: jest.fn(() => of({ token: TOKEN })) };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('construit le formulaire a l initialisation', () => {
    expect(component.loginForm.contains('login')).toBe(true);
    expect(component.loginForm.contains('password')).toBe(true);
  });

  it('onSubmit envoie les identifiants puis redirige vers la liste', () => {
    component.loginForm.setValue(CREDENTIALS);

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(CREDENTIALS);
    expect(component.success).toBe(true);
    expect(component.loading).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('onSubmit n envoie rien tant que le formulaire est vide', () => {
    // Les deux champs sont Validators.required : le formulaire vide est invalide,
    // onSubmit sort avant tout appel reseau.
    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('onReset vide le formulaire et les messages', () => {
    component.loginForm.setValue(CREDENTIALS);
    component.submitted = true;
    component.success = true;

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.success).toBe(false);
    expect(component.errorMessage).toBeNull();
    expect(component.loginForm.get('login')?.value).toBeNull();
  });
});
