import { Component, OnInit } from '@angular/core';
import { ScoreData } from '../interfaces/score-data.interface';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScoreService } from '../services/score.service';
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage.service';
import { ExamService } from '../services/exam.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss'
})
export class ScoreComponent implements OnInit {
  scores: Array<ScoreData> = [];
  createScoreForm: FormGroup;
  editingScore: ScoreData | null = null;
  showCreateScoreForm: boolean = false;
  constructor(private scoreService: ScoreService, private storage: StorageService, private formBuilder: FormBuilder, private examService: ExamService, private studentService:StudentService) {
    this.createScoreForm = this.formBuilder.group({
      points: ['', Validators.required],
      comment: ['', Validators.required],
      grade_id: ['', Validators.required],
      exam_id: ['', Validators.required],
      student_id: ['', Validators.required],
    })
  }
  ngOnInit(): void {
    this.scoreService.getAllScores().subscribe((scoreArray) => {
      scoreArray.forEach(score => {
        this.examService.getExamById(score.exam_id).subscribe(exam => {
          score.examName = exam.name;
        });
        this.studentService.getStudentById(score.student_id).subscribe(student => {
          score.studentName = student.vorname + ' ' +student.nachname;
        });
      });
      this.scores = scoreArray;
    });
  }

  openCreateScoreForm() {
    this.editingScore = null;
    this.showCreateScoreForm = true;
    this.createScoreForm.reset({
      points: '',
      comment: '',
      grade_id: '',
      exam_id: '',
      student_id: ''
    })
  }

  editScore(scoreData: ScoreData) {
    this.showCreateScoreForm = true;
    this.editingScore = scoreData;
    this.createScoreForm.setValue({
      points: scoreData.points,
      comment: scoreData.comment,
      grade_id: scoreData.grade_id,
      exam_id: scoreData.exam_id,
      student_id: scoreData.student_id,
    })
  }

  createScore() {
    const isAdmin = this.storage.getSessionEntry('is_admin');
      if(this.createScoreForm.valid) {
        if(this.editingScore) {
          this.scoreService.editScore(this.editingScore.ID, this.createScoreForm.value).subscribe(() => {
            if(isAdmin === true) {
              this.scoreService.getAllScores().subscribe((scoresArray) => {
                scoresArray.forEach(score => {
                  this.examService.getExamById(score.exam_id).subscribe(exam => {
                    score.examName = exam.name;
                  });
                  this.studentService.getStudentById(score.student_id).subscribe(student => {
                    score.studentName = student.vorname + ' ' +student.nachname;
                  });
                });
                this.scores = scoresArray;
              })
            }
            if(isAdmin === false) {
              // TODO Implement non Admin-case
              this.scoreService.getAllScores().subscribe((scoresArray) => {
                scoresArray.forEach(score => {
                  this.examService.getExamById(score.exam_id).subscribe(exam => {
                    score.examName = exam.name;
                  });
                  this.studentService.getStudentById(score.student_id).subscribe(student => {
                    score.studentName = student.vorname + ' ' +student.nachname;
                  });
                });
                this.scores = scoresArray;
              })
            }
          })
        } else {
          this.scoreService.createScore(this.createScoreForm.value).subscribe(() => {
            if(isAdmin === true) {
              this.scoreService.getAllScores().subscribe((scoresArray) => {
                scoresArray.forEach(score => {
                  this.examService.getExamById(score.exam_id).subscribe(exam => {
                    score.examName = exam.name;
                  });
                  this.studentService.getStudentById(score.student_id).subscribe(student => {
                    score.studentName = student.vorname + ' ' +student.nachname;
                  });
                });
                this.scores = scoresArray;
              })
            }
            if(isAdmin === false) {
              // TODO Implement non Admin-case
              this.scoreService.getAllScores().subscribe((scoresArray) => {
                scoresArray.forEach(score => {
                  this.examService.getExamById(score.exam_id).subscribe(exam => {
                    score.examName = exam.name;
                  });
                  this.studentService.getStudentById(score.student_id).subscribe(student => {
                    score.studentName = student.vorname + ' ' +student.nachname;
                  });
                });
                this.scores = scoresArray;
              })
            }
          })
        }
        this.showCreateScoreForm = false;
      }
  };

  deleteScore(scoreId: number) {
    const isAdmin = this.storage.getSessionEntry('is_admin')
    this.scoreService.deleteScore(scoreId).subscribe(() => {
      if(isAdmin === true) {
        this.scoreService.getAllScores().subscribe((scoresArray) => {
          scoresArray.forEach(score => {
            this.examService.getExamById(score.exam_id).subscribe(exam => {
              score.examName = exam.name;
            });
            this.studentService.getStudentById(score.student_id).subscribe(student => {
              score.studentName = student.vorname + ' ' +student.nachname;
            });
          });
          this.scores = scoresArray;
        })
      }
      // TODO Implement non Admin-case
      if(isAdmin === false) {
        this.scoreService.getAllScores().subscribe((scoresArray) => {
          scoresArray.forEach(score => {
            this.examService.getExamById(score.exam_id).subscribe(exam => {
              score.examName = exam.name;
            });
            this.studentService.getStudentById(score.student_id).subscribe(student => {
              score.studentName = student.vorname + ' ' +student.nachname;
            });
          });
          this.scores = scoresArray;
        })
      }
    })
  }

  numberValidator(control: FormControl): {[key: string]: any} | null {
    const valid = /^\d+$/.test(control.value);
    return valid ? null : { 'notANumber': true };
  };
}
