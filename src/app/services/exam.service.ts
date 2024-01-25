import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { CreateExamDTO } from '../model/createExamDTO';
import { ExamData } from '../interfaces/exam-data.interface';


@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private http:HttpClient, private storage: StorageService) { }
  examsUrl = '/api/api/v1/exams';

  getAuthorizationHeader(): HttpHeaders | { [header: string]: string | string[]; } | undefined {
    const baseCredentials = this.storage.getSessionEntry('basic-auth-key');
    return new HttpHeaders({
      'Authorization': 'Basic ' + baseCredentials
    });
  }


  getAllExamsArray(): Observable<ExamData[]> {
    const headers = this.getAuthorizationHeader();
    if (headers) {
      return this.http.get<ExamData[]>(this.examsUrl, { headers });
    } else {
      return this.http.get<ExamData[]>(this.examsUrl);
    }
  }
  createExam(examBody: CreateExamDTO): Observable<any> {
    const headers = this.getAuthorizationHeader();
    return this.http.post(this.examsUrl, examBody, {headers});
  }
  editExam(examId: number, examBody: CreateExamDTO): Observable<any> {
    const headers = this.getAuthorizationHeader();
    const url = `${this.examsUrl}/${examId}`
    return this.http.put(url, examBody, { headers });
  }
  deleteExam(examId: number) {
    const headers = this.getAuthorizationHeader();
    const url = `${this.examsUrl}/${examId}`
    return this.http.delete(url, {headers: headers});
  }
}
