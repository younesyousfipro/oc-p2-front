import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { StudentService } from '../../core/service/student.service';
import { StudentRequest } from '../../core/models/StudentRequest';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// task5 - ecran d'ajout. Meme squelette que LoginComponent : formulaire reactif,
// trois etats, redirection au succes.
@Component({
  selector: 'app-student-create',
  imports: [CommonModule, MaterialModule],
  templateUrl: './student-create.component.html',
  standalone: true,
  styleUrl: './student-create.component.css'
})
export class StudentCreateComponent implements OnInit {
  private studentService = inject(StudentService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  studentForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null;

  ngOnInit() {
    this.studentForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      },
    );
  }

  get form() {
    return this.studentForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (this.studentForm.invalid) {
      return;
    }

    const student: StudentRequest = {
      firstName: this.studentForm.get('firstName')?.value,
      lastName: this.studentForm.get('lastName')?.value,
      email: this.studentForm.get('email')?.value
    };

    this.loading = true;
    this.studentService.create(student)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/students']);
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          // Le back renvoie 400 + { message } sur un email deja utilise : son
          // message est affichable tel quel.
          this.errorMessage = error.error?.message ?? 'Unable to create student';
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/students']);
  }
}
