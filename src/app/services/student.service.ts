import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { SchoolStudentData } from '../interfaces/school-student-data.interface';

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

  getAllStudents(): Observable<SchoolStudentData[]> {
    const headers = this.getAuthorizationHeader();
    if (headers) {
      return this.http.get<SchoolStudentData[]>(this.getAllStudentsUrl, { headers });
    } else {
      return this.http.get<SchoolStudentData[]>(this.getAllStudentsUrl);
    }
  }

}
