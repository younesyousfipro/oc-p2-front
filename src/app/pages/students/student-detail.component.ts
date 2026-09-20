import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// task5 - ecran de detail, et suppression depuis cet ecran.
// Nouveaute par rapport aux precedents : l'id est lu dans l'URL, pas saisi.
@Component({
  selector: 'app-student-detail',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './student-detail.component.html',
  standalone: true,
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent implements OnInit {
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  student: Student | null = null;
  loading: boolean = false;
  errorMessage: string | null = null;

  ngOnInit() {
    // snapshot lit l'URL une seule fois, au moment ou le composant est cree.
    // Suffisant ici : on arrive toujours depuis la liste, donc le composant est
    // reconstruit a chaque fois.
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadStudent(id);
  }

  loadStudent(id: number): void {
    this.loading = true;
    this.errorMessage = null;

    this.studentService.findById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (student) => {
          this.student = student;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage = error.error?.message ?? 'Unable to load student';
        }
      });
  }

  onDelete(): void {
    if (!this.student) {
      return;
    }
    if (!confirm(`Delete ${this.student.firstName} ${this.student.lastName} ?`)) {
      return;
    }

    this.loading = true;
    this.studentService.delete(this.student.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/students']),
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage = error.error?.message ?? 'Unable to delete student';
        }
      });
  }

  onBack(): void {
    this.router.navigate(['/students']);
  }
}
