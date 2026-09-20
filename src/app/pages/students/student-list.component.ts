import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// task5 - ecran liste, le plus simple : lecture seule.
// Memes trois etats que LoginComponent : chargement, erreur, succes.
@Component({
  selector: 'app-student-list',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './student-list.component.html',
  standalone: true,
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private destroyRef = inject(DestroyRef);

  students: Student[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

  // ngOnInit est appele par Angular une fois le composant construit. C'est ici que
  // l'on declenche les chargements, pas dans le constructeur.
  ngOnInit() {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.errorMessage = null;

    this.studentService.findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (students) => {
          this.students = students;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          // Le 401 est deja traite par l'intercepteur, qui redirige vers /login.
          // Ici on ne couvre que les autres pannes.
          this.errorMessage = 'Unable to load students';
        }
      });
  }
}
