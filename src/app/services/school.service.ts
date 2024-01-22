import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetSchoolListResponseDTO } from '../model/getSchoolListResponseDTO';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  getAllSchoolsUrl = '/api/api/v1/schools';

  constructor(private http: HttpClient, private storage:StorageService) { }

  getAuthorizationHeader(): HttpHeaders | { [header: string]: string | string[]; } | undefined {
      const baseCredentials = this.storage.getSessionEntry('basic-auth-key');
      return new HttpHeaders({
        'Authorization': 'Basic ' + baseCredentials
      });
    }

  getAllSchools(): Observable<GetSchoolListResponseDTO[]> {
    const headers = this.getAuthorizationHeader();
    if (headers) {
      return this.http.get<GetSchoolListResponseDTO[]>(this.getAllSchoolsUrl, { headers });
    } else {
      return this.http.get<GetSchoolListResponseDTO[]>(this.getAllSchoolsUrl);
    }
  }
}
