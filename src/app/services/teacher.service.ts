import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { TeacherData } from '../interfaces/teacher-data.interface';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private storage: StorageService, private http: HttpClient) { }
  teacherUrl: string = '/api/api/v1/users';
  getAuthorizationHeader(): HttpHeaders | { [header: string]: string | string[]; } | undefined {
    const baseCredentials = this.storage.getSessionEntry('basic-auth-key');
    return new HttpHeaders({
      'Authorization': 'Basic ' + baseCredentials
    });
  }

  getOneTeacherById(id: number): Observable<TeacherData> {
    const header = this.getAuthorizationHeader();
    const url = `${this.teacherUrl}/${id}`;
    return this.http.get<TeacherData>(url, { headers: header})
  }
}
