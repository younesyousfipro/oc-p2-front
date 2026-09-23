import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';

// task-tests - spec fourni par OpenClassrooms, complete.
//
// UserMockService a ete remplace par une doublure jest : le mock d'origine etait
// fourni via useValue (la classe, pas une instance) et son register() renvoyait
// of(), un Observable qui se termine sans rien emettre. Le subscribe du composant
// n'etait donc jamais appele, et la redirection intestable.
describe('RegisterComponent', () => {
  const formValues = {
    firstName: 'Jean',
    lastName: 'Dupont',
    login: 'jdupont',
    password: 'password',
  };

  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: { register: jest.Mock };
  let router: Router;

  beforeEach(async () => {
    userService = { register: jest.fn(() => of({})) };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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
    expect(component.registerForm.contains('firstName')).toBe(true);
    expect(component.registerForm.contains('lastName')).toBe(true);
    expect(component.registerForm.contains('login')).toBe(true);
    expect(component.registerForm.contains('password')).toBe(true);
  });

  it('onSubmit inscrit l agent puis l emmene vers le login', () => {
    component.registerForm.setValue(formValues);

    component.onSubmit();

    expect(userService.register).toHaveBeenCalledWith(formValues);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('onSubmit n envoie rien tant que le formulaire est vide', () => {
    component.onSubmit();

    expect(userService.register).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('onReset vide le formulaire', () => {
    component.registerForm.setValue(formValues);
    component.submitted = true;

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.registerForm.get('login')?.value).toBeNull();
  });
});
