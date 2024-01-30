import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { SucsData } from '../interfaces/sucs-data.interface';

@Injectable({
  providedIn: 'root'
})
export class SucsService {

  constructor(private http: HttpClient, private storage: StorageService) { }
  sucsUrl = 'api/api/v1/sucs';

  getAuthorizationHeader(): HttpHeaders | { [header: string]: string | string[]; } | undefined {
    const baseCredentials = this.storage.getSessionEntry('basic-auth-key');
    return new HttpHeaders({
      'Authorization': 'Basic ' + baseCredentials
    });
  }

  getAllSucs(): Observable<SucsData[]> {
    const header = this.getAuthorizationHeader();
    return this.http.get<SucsData[]>(this.sucsUrl, {headers: header});
  }
}
