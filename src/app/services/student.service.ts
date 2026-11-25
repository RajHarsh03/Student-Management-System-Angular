import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly apiUrl = 'http://localhost:3000/students';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl, {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    });
  }

  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: Omit<Student, 'id'>): Observable<Student> {
    return this.getStudents().pipe(
      map(students => {
        const maxId = students.reduce((max, s) => {
          const num = parseInt(s.id, 10);
          return !isNaN(num) && num > max ? num : max;
        }, 0);
        return String(maxId + 1);
      }),
      switchMap(nextId =>
        this.http.post<Student>(this.apiUrl, { id: nextId, ...student })
      )
    );
  }

  updateStudent(id: string, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
