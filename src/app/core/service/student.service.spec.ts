import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { StudentService } from './student.service';
import { Student } from '../models/Student';
import { StudentRequest } from '../models/StudentRequest';

// task-tests - tests unitaires du client HTTP des cinq routes etudiants.
//
// Aucune requete ne part reellement : provideHttpClientTesting remplace le backend
// par un HttpTestingController, qui intercepte les requetes emises et permet de leur
// repondre a la main. Un test verifie donc l'URL et le verbe envoyes, puis ce que le
// service fait de la reponse.
describe('StudentService', () => {
  const BASE_URL = '/api/students';
  const student: Student = {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@test.fr',
  };
  const studentRequest: StudentRequest = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@test.fr',
  };

  let service: StudentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Echoue si une requete a ete emise sans qu'aucun test ne la consomme.
    httpMock.verify();
  });

  it('findAll appelle GET /api/students', () => {
    let result: Student[] | undefined;
    service.findAll().subscribe(students => (result = students));

    const request = httpMock.expectOne(BASE_URL);
    expect(request.request.method).toBe('GET');
    request.flush([student]);

    expect(result).toEqual([student]);
  });

  it('findById appelle GET /api/students/1', () => {
    let result: Student | undefined;
    service.findById(1).subscribe(found => (result = found));

    const request = httpMock.expectOne(`${BASE_URL}/1`);
    expect(request.request.method).toBe('GET');
    request.flush(student);

    expect(result).toEqual(student);
  });

  it('create appelle POST /api/students avec le corps attendu', () => {
    let result: Student | undefined;
    service.create(studentRequest).subscribe(created => (result = created));

    const request = httpMock.expectOne(BASE_URL);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(studentRequest);
    request.flush(student);

    expect(result).toEqual(student);
  });

  it('update appelle PUT /api/students/1 avec le corps attendu', () => {
    let result: Student | undefined;
    service.update(1, studentRequest).subscribe(updated => (result = updated));

    const request = httpMock.expectOne(`${BASE_URL}/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(studentRequest);
    request.flush(student);

    expect(result).toEqual(student);
  });

  it('delete appelle DELETE /api/students/1', () => {
    let completed = false;
    service.delete(1).subscribe(() => (completed = true));

    const request = httpMock.expectOne(`${BASE_URL}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);

    expect(completed).toBe(true);
  });
});
