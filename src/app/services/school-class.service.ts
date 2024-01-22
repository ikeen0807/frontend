import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetClassListResponseDTO } from '../model/getClassesListResponseDTO';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { ClassListData } from '../interfaces/class-list-data.interface';
import { createSchoolClassDTO } from '../model/createSchoolClassDTO';

@Injectable({
  providedIn: 'root'
})
export class SchoolClassService {

  constructor(private http: HttpClient, private storage:StorageService) { }
  SchoolClassesUrl = '/api/api/v1/classes';

  getAuthorizationHeader(): HttpHeaders | { [header: string]: string | string[]; } | undefined {
    const baseCredentials = this.storage.getSessionEntry('basic-auth-key');
    return new HttpHeaders({
      'Authorization': 'Basic ' + baseCredentials
    });
  }

  getAllSchoolClasses(): Observable<GetClassListResponseDTO> {
    const headers = this.getAuthorizationHeader();
    if (headers) {
      return this.http.get<GetClassListResponseDTO>(this.SchoolClassesUrl, { headers });
    } else {
      return this.http.get<GetClassListResponseDTO>(this.SchoolClassesUrl);
    }
  }

  getAllSchoolClassesArray(): Observable<ClassListData[]> {
    const headers = this.getAuthorizationHeader();

    if (headers) {
      return this.http.get<ClassListData[]>(this.SchoolClassesUrl, { headers });
    } else {
      return this.http.get<ClassListData[]>(this.SchoolClassesUrl);
    }
  }
  createSchoolClass(schoolClassBody: createSchoolClassDTO): Observable<any> {
    const headers = this.getAuthorizationHeader();
    return this.http.post(this.SchoolClassesUrl, schoolClassBody, {headers});
  }
}
