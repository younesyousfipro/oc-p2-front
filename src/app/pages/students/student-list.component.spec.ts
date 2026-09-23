import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { StudentListComponent } from './student-list.component';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

// task-tests - premier test de composant, il pose le moule des quatre suivants.
//
// StudentService est remplace par une doublure qui renvoie un Observable deja pret
// (of). Le composant est donc teste seul : aucun HTTP, aucune vraie navigation.
describe('StudentListComponent', () => {
  const students: Student[] = [
    { id: 1, firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@test.fr' },
    { id: 2, firstName: 'Marie', lastName: 'Martin', email: 'marie.martin@test.fr' },
  ];

  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let studentService: { findAll: jest.Mock };

  beforeEach(async () => {
    studentService = { findAll: jest.fn(() => of(students)) };

    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        provideRouter([]),
        { provide: StudentService, useValue: studentService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('charge la liste des etudiants a l initialisation', () => {
    // detectChanges declenche le premier rendu, et avec lui ngOnInit : c'est lui
    // qui appelle loadStudents. Sans cet appel, rien ne se passe.
    fixture.detectChanges();

    expect(studentService.findAll).toHaveBeenCalled();
    expect(component.students).toEqual(students);
    expect(component.loading).toBe(false);
  });
});
