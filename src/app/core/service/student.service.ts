import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/Student';
import { StudentRequest } from '../models/StudentRequest';

// task5 - client HTTP des cinq routes CRUD etudiants.
//
// Une methode par route, rien d'autre : ni gestion d'erreur, ni stockage, ni
// ajout du token. Ce dernier sera pose par l'intercepteur (lot 2), une fois pour
// toutes les requetes, au lieu d'etre repete ici cinq fois.
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private static readonly BASE_URL = '/api/students';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(StudentService.BASE_URL);
  }

  findById(id: number): Observable<Student> {
    return this.httpClient.get<Student>(`${StudentService.BASE_URL}/${id}`);
  }

  create(student: StudentRequest): Observable<Student> {
    return this.httpClient.post<Student>(StudentService.BASE_URL, student);
  }

  update(id: number, student: StudentRequest): Observable<Student> {
    return this.httpClient.put<Student>(`${StudentService.BASE_URL}/${id}`, student);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${StudentService.BASE_URL}/${id}`);
  }
}
