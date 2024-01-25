import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { ScoreData } from '../interfaces/score-data.interface';
import { CreateScoreDTO } from '../model/createScoreDTO';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private http: HttpClient, private storage: StorageService) { }
  scoreUrl = '/api/api/v1/scores';

  getAuthorizationHeader(): HttpHeaders | { [header: string]: string | string[]; } | undefined {
    const baseCredentials = this.storage.getSessionEntry('basic-auth-key');
    return new HttpHeaders({
      'Authorization': 'Basic ' + baseCredentials
    });
  }


  getAllScores(): Observable<ScoreData[]> {
    const headers = this.getAuthorizationHeader();
    if (headers) {
      return this.http.get<ScoreData[]>(this.scoreUrl, { headers });
    } else {
      return this.http.get<ScoreData[]>(this.scoreUrl);
    }
  }
  createScore(scoreBody: CreateScoreDTO): Observable<any> {
    const headers = this.getAuthorizationHeader();
    return this.http.post(this.scoreUrl, scoreBody, {headers});
  }
  editScore(scoreId: number, scoreBody: CreateScoreDTO): Observable<any> {
    const headers = this.getAuthorizationHeader();
    const url = `${this.scoreUrl}/${scoreId}`
    return this.http.put(url, scoreBody, { headers });
  }
  deleteScore(scoreId: number) {
    const headers = this.getAuthorizationHeader();
    const url = `${this.scoreUrl}/${scoreId}`
    return this.http.delete(url, {headers: headers});
  }
}
