import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginData } from '../interfaces/loginData.interface';
import { Observable } from 'rxjs';
import { UserResponse } from '../model/getUserResponseDTO';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = "/api/auth";

  constructor(private httpClient: HttpClient, private storage: StorageService) {}

    private base64Credentials?: string;

  storeCredentials(username: string, password: string): void {
    this.base64Credentials = btoa(username + ':' + password);
    this.storage.setSessionEntry('basic-auth-key', this.base64Credentials)
  }

  getAuthorizationHeader(): HttpHeaders | { [header: string]: string | string[]; } | undefined {
    if (this.base64Credentials) {
      console.log(this.base64Credentials + 'In der Header Funktion');
      const baseCredentials = this.storage.getSessionEntry('basic-auth-key');
      return new HttpHeaders({
        'Authorization': 'Basic ' + baseCredentials
      });
    } else {
      return undefined;
    }
  }

  login(loginBody: LoginData): Observable<UserResponse> {
    this.storeCredentials(loginBody.username, loginBody.password);
    const header = this.getAuthorizationHeader();
    return this.httpClient.post<UserResponse>(this.apiUrl, {}, { headers: header });
  }


}
