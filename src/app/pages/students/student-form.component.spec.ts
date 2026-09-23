import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

// task-tests - le composant sert deux routes : /students/new et /students/:id/edit.
// Le mode se deduit de la presence d'un id dans l'URL, donc chaque mode demande sa
// propre ActivatedRoute. D'ou les deux blocs describe, chacun avec son montage.
describe('StudentFormComponent', () => {
  const student: Student = {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@test.fr',
  };
  const formValues = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@test.fr',
  };

  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let studentService: { findById: jest.Mock; create: jest.Mock; update: jest.Mock };
  let router: Router;

  const setup = async (id: string | null) => {
    studentService = {
      findById: jest.fn(() => of(student)),
      create: jest.fn(() => of(student)),
      update: jest.fn(() => of(student)),
    };

    await TestBed.configureTestingModule({
      imports: [StudentFormComponent],
      providers: [
        provideRouter([]),
        { provide: StudentService, useValue: studentService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('mode creation (/students/new)', () => {
    beforeEach(async () => {
      await setup(null);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('ouvre un formulaire vide sans charger d etudiant', () => {
      expect(component.isEditMode).toBe(false);
      expect(component.studentId).toBeNull();
      expect(studentService.findById).not.toHaveBeenCalled();
      expect(component.studentForm.get('firstName')?.value).toBe('');
    });

    it('onSubmit appelle create puis revient a la liste', () => {
      component.studentForm.setValue(formValues);

      component.onSubmit();

      expect(studentService.create).toHaveBeenCalledWith(formValues);
      expect(component.loading).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/students']);
    });

    it('onSubmit n envoie rien tant que le formulaire est vide', () => {
      component.onSubmit();

      expect(studentService.create).not.toHaveBeenCalled();
      expect(component.submitted).toBe(true);
    });

    it('onCancel revient a la liste', () => {
      component.onCancel();

      expect(router.navigate).toHaveBeenCalledWith(['/students']);
    });
  });

  describe('mode modification (/students/1/edit)', () => {
    beforeEach(async () => {
      await setup('1');
    });

    it('charge l etudiant et pre-remplit le formulaire', () => {
      expect(component.isEditMode).toBe(true);
      expect(component.studentId).toBe(1);
      expect(studentService.findById).toHaveBeenCalledWith(1);
      expect(component.studentForm.get('firstName')?.value).toBe(student.firstName);
      expect(component.studentForm.get('email')?.value).toBe(student.email);
      expect(component.loading).toBe(false);
    });

    it('onSubmit appelle update avec l id de l URL', () => {
      component.studentForm.setValue(formValues);

      component.onSubmit();

      expect(studentService.update).toHaveBeenCalledWith(1, formValues);
      expect(studentService.create).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/students']);
    });
  });
});
