import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../shared/material.module';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';
import { StudentRequest } from '../../core/models/StudentRequest';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// task5 - formulaire etudiant, partage par la creation et la modification.
//
// Les deux ecrans avaient 44 lignes de gabarit identiques sur 45 : seul le titre
// differait. Un composant unique, deux routes, un mode determine par la presence
// d'un id dans l'URL.
//
// L'utilisateur voit toujours deux ecrans distincts : deux URLs, deux titres.
// Seul le code est mutualise.
@Component({
  selector: 'app-student-form',
  imports: [CommonModule, MaterialModule],
  templateUrl: './student-form.component.html',
  standalone: true,
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit {
  private studentService = inject(StudentService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  studentForm: FormGroup = new FormGroup({});
  studentId: number | null = null;
  submitted: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null;

  get isEditMode(): boolean {
    return this.studentId !== null;
  }

  ngOnInit() {
    this.studentForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      },
    );

    // /students/new    -> pas de parametre id -> mode creation
    // /students/42/edit -> id present        -> mode modification
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.studentId = Number(id);
      this.loadStudent();
    }
  }

  get form() {
    return this.studentForm.controls;
  }

  private loadStudent(): void {
    this.loading = true;

    this.studentService.findById(this.studentId!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (student: Student) => {
          this.studentForm.patchValue({
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email
          });
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage = error.error?.message ?? 'Unable to load student';
        }
      });
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

    // Seule vraie difference entre les deux modes : la methode appelee.
    const request: Observable<Student> = this.studentId === null
      ? this.studentService.create(student)
      : this.studentService.update(this.studentId, student);

    this.loading = true;
    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/students']);
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage = error.error?.message ?? 'Unable to save student';
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/students']);
  }
}
