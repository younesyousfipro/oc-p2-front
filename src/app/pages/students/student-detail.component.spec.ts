import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { StudentDetailComponent } from './student-detail.component';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

// task-tests - meme moule que StudentListComponent, avec deux nouveautes :
// l'id vient de l'URL (ActivatedRoute double) et la suppression navigue (Router espionne).
describe('StudentDetailComponent', () => {
  const student: Student = {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@test.fr',
  };

  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;
  let studentService: { findById: jest.Mock; delete: jest.Mock };
  let router: Router;

  beforeEach(async () => {
    studentService = {
      findById: jest.fn(() => of(student)),
      delete: jest.fn(() => of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [StudentDetailComponent],
      providers: [
        provideRouter([]),
        { provide: StudentService, useValue: studentService },
        // Le composant lit l'id dans l'URL : on simule la route /students/1.
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;

    // Le vrai Router est conserve (le template contient des routerLink), mais on
    // espionne navigate pour observer la redirection sans changer de page.
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('charge l etudiant designe par l URL', () => {
    fixture.detectChanges();

    expect(studentService.findById).toHaveBeenCalledWith(1);
    expect(component.student).toEqual(student);
    expect(component.loading).toBe(false);
  });

  it('onDelete supprime l etudiant puis revient a la liste', () => {
    // jsdom n'implemente pas confirm() : on le remplace pour simuler un agent
    // qui valide la boite de dialogue.
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    fixture.detectChanges();

    component.onDelete();

    expect(studentService.delete).toHaveBeenCalledWith(1);
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('onBack revient a la liste', () => {
    fixture.detectChanges();

    component.onBack();

    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });
});
