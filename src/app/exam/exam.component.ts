import { Component, OnInit } from '@angular/core';
import { ExamService } from '../services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { ExamData } from '../interfaces/exam-data.interface';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.scss'
})
export class ExamComponent implements OnInit {
  exams: Array<ExamData> = [];
  createExamForm: FormGroup;
  editingExam: ExamData | null = null;
  showCreateExamForm: boolean = false;
  constructor(private examService: ExamService, private storage: StorageService, private formBuilder: FormBuilder) {
    this.createExamForm = this.formBuilder.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      max_points: ['', Validators.required],
      description: ['', Validators.required],
      exam_type_id: ['', Validators.required],
    })
  }
  ngOnInit(): void {
    this.examService.getAllExamsArray().subscribe((examArray) => {
      this.exams = examArray;
    });
  }

  openCreateExamForm() {
    this.editingExam = null;
    this.showCreateExamForm = true;
    this.createExamForm.reset({
      name: '',
      date: '',
      max_points: '',
      description: '',
      exam_type_id: ''
    })
  }

  editExam(examData: ExamData) {
    this.showCreateExamForm = true;
    this.editingExam = examData;
    this.createExamForm.setValue({
      name: examData.name,
      date: examData.date,
      max_points: examData.max_points,
      description: examData.description,
      exam_type_id: examData.exam_type_id,
    })
  }

  createExam() {
    const isAdmin = this.storage.getSessionEntry('is_admin');
      if(this.createExamForm.valid) {
        if(this.editingExam) {
          this.examService.editExam(this.editingExam.ID, this.createExamForm.value).subscribe(() => {
            if(isAdmin === true) {
              this.examService.getAllExamsArray().subscribe((examsArray) => {
                this.exams = examsArray;
              })
            }
            if(isAdmin === false) {
              // TODO Implement non Admin-case
              this.examService.getAllExamsArray().subscribe((examsArray) => {
                this.exams = examsArray;
              })
            }
          })
        } else {
          this.examService.createExam(this.createExamForm.value).subscribe(() => {
            if(isAdmin === true) {
              this.examService.getAllExamsArray().subscribe((examsArray) => {
                this.exams = examsArray;
              })
            }
            if(isAdmin === false) {
              // TODO Implement non Admin-case
              this.examService.getAllExamsArray().subscribe((examsArray) => {
                this.exams = examsArray;
              })
            }
          })
        }
        this.showCreateExamForm = false;
      }
  };

  deleteExam(examId: number) {
    const isAdmin = this.storage.getSessionEntry('is_admin')
    this.examService.deleteExam(examId).subscribe(() => {
      if(isAdmin === true) {
        this.examService.getAllExamsArray().subscribe((examsArray) => {
          this.exams = examsArray;
        })
      }
      // TODO Implement non Admin-case
      if(isAdmin === false) {
        this.examService.getAllExamsArray().subscribe((examsArray) => {
          this.exams = examsArray;
        })
      }
    })
  }

  numberValidator(control: FormControl): {[key: string]: any} | null {
    const valid = /^\d+$/.test(control.value);
    return valid ? null : { 'notANumber': true };
  };
}
