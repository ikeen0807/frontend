import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { SchoolStudentData } from '../interfaces/school-student-data.interface';
import { CreateStudentDTO } from '../model/createStudentDTO';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient, private storage:StorageService) { }
  getAllStudentsUrl = '/api/api/v1/students';

  getAuthorizationHeader(): HttpHeaders | { [header: string]: string | string[]; } | undefined {
    const baseCredentials = this.storage.getSessionEntry('basic-auth-key');
    return new HttpHeaders({
      'Authorization': 'Basic ' + baseCredentials
    });
  }

  createStudent(studentBody: CreateStudentDTO): Observable<any> {
    const headers = this.getAuthorizationHeader();
    return this.http.post(this.getAllStudentsUrl, studentBody, {headers: headers});
  }

  editStudent(studentId: number, studentBody: CreateStudentDTO): Observable<any> {
    const headers = this.getAuthorizationHeader();
    const url = `${this.getAllStudentsUrl}/${studentId}`;
    return this.http.put(url, studentBody, {headers: headers});
  }

  deleteStudent(studentId: number) {
    const headers = this.getAuthorizationHeader();
    const url = `${this.getAllStudentsUrl}/${studentId}`;
    return this.http.delete(url, {headers: headers});
  }

  getAllStudents(): Observable<SchoolStudentData[]> {
    const headers = this.getAuthorizationHeader();
    if (headers) {
      return this.http.get<SchoolStudentData[]>(this.getAllStudentsUrl, { headers });
    } else {
      return this.http.get<SchoolStudentData[]>(this.getAllStudentsUrl);
    }
  }

  getStudentByClass(classId: number): Observable<SchoolStudentData[]> {
    const headers = this.getAuthorizationHeader();
    const url = `${this.getAllStudentsUrl}/${classId}`
    if (headers) {
      return this.http.get<SchoolStudentData[]>(url, { headers });
    } else {
      return this.http.get<SchoolStudentData[]>(url);
    }
  }

  getStudentById(studentId: number): Observable<SchoolStudentData> {
    const headers = this.getAuthorizationHeader();
    const url = `${this.getAllStudentsUrl}/${studentId}`
    if (headers) {
      return this.http.get<SchoolStudentData>(url, { headers });
    } else {
      return this.http.get<SchoolStudentData>(url);
    }
  }

}
