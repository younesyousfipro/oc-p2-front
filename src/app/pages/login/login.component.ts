import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../shared/material.module';
import { AuthService } from '../../core/service/auth.service';
import { Login } from '../../core/models/Login';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// task3 - ecran de login. Meme structure que RegisterComponent, avec en plus la
// gestion explicite des trois etats demandes par la consigne : chargement, erreur,
// succes. RegisterComponent ne les gere pas (alert() et erreurs ignorees).
@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  loading: boolean = false;
  success: boolean = false;
  errorMessage: string | null = null;

  ngOnInit() {
    this.loginForm = this.formBuilder.group(
      {
        login: ['', Validators.required],
        password: ['', Validators.required]
      },
    );
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;
    this.success = false;

    if (this.loginForm.invalid) {
      return;
    }

    const credentials: Login = {
      login: this.loginForm.get('login')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.loading = true;
    this.authService.login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          // 401 = identifiants refuses par le serveur, son message est affichable tel
          // quel. Tout autre code releve d'une panne technique : message generique.
          this.errorMessage = error.status === 401
            ? error.error?.message ?? 'Invalid credentials'
            : 'Server unavailable, please try again later';
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.success = false;
    this.errorMessage = null;
    this.loginForm.reset();
  }
}
