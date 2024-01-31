import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, FormControl } from '@angular/forms';
import { SchoolClassService } from '../services/school-class.service';
import { ClassListData } from '../interfaces/class-list-data.interface';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { TeacherService } from '../services/teacher.service';
import { SchoolService } from '../services/school.service';
import { StudentService } from '../services/student.service';
import { SchoolStudentData } from '../interfaces/school-student-data.interface';
import { ScoreService } from '../services/score.service';
import { ScoreData } from '../interfaces/score-data.interface';
import { ExamService } from '../services/exam.service';


@Component({
  selector: 'app-school-class-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './school-class-list.component.html',
  styleUrl: './school-class-list.component.scss'
})
export class SchoolClassListComponent implements OnInit {
  classes: Array<ClassListData> = [];
  filteredScores: Array<ScoreData> = [];
  createClassForm: FormGroup;
  editingClass: ClassListData | null = null;
  showCreateClassForm: boolean = false;
  selectedClass: ClassListData | null = null;
  showStudentOverview: boolean = false;
  studentData: SchoolStudentData | null = null;

  constructor(private exam: ExamService, private score: ScoreService, private student: StudentService, private school: SchoolService, private schoolClassService: SchoolClassService, private fb: FormBuilder, private storage: StorageService, private teacher: TeacherService) {
    this.createClassForm = this.fb.group({
      name: ['', Validators.required],
      is_active: [false],
      year: ['', Validators.required],
      school_id: ['', [Validators.required, this.numberValidator]],
      teacher_id: ['', [Validators.required, this.numberValidator]]
    });
   }

  ngOnInit() {
    if(this.storage.getSessionEntry('is_admin') === true) {
    this.schoolClassService.getAllSchoolClassesArray().subscribe((classesArray) => {
      classesArray.forEach(schoolClass => {
        this.teacher.getOneTeacherById(schoolClass.teacher_id).subscribe(teacherData => {
          const teacherFullname = `${teacherData.vorname} ${teacherData.nachname}`;
          schoolClass.teacherName = teacherFullname;
        })
      })
      this.classes = classesArray;
    });
    } else {
      this.schoolClassService.getAllSchoolClassesArrayById(this.storage.getSessionEntry('school_id')).subscribe((classesArray) =>{
        classesArray.forEach(schoolClass => {
          this.teacher.getOneTeacherById(schoolClass.teacher_id).subscribe(teacherData => {
            const teacherFullname = `${teacherData.vorname} ${teacherData.nachname}`;
            schoolClass.teacherName = teacherFullname;
          })
        })
        classesArray.forEach(schoolClass => {
          this.school.getSchoolById(schoolClass.school_id).subscribe(schoolData => {
            schoolClass.schoolName =  schoolData.name;
          })
        })
        this.classes = classesArray;
      })
    }
  }

  openCreateClassForm() {
    this.editingClass = null;
    this.showCreateClassForm = true;
    this.createClassForm.reset({
      name: '',
      is_active: false,
      year: '',
      school_id: this.storage.getSessionEntry('school_id'),
      teacher_id: ''
    });
  }

  openStudentOverview(studentId: number) {
    this.showStudentOverview = true;
    this.student.getStudentById(studentId).subscribe((student) => {
      this.studentData = student;
      if(this.studentData !== null && this.studentData !== undefined) {
      this.schoolClassService.getClassById(student.class_id).subscribe((schoolClass) => {
        this.studentData!.className = schoolClass.name;
      })
    }
    })
     // Abfrage aller Scores und Filterung nach der studentId
  this.score.getAllScores().subscribe((allScores) => {
    this.filteredScores = allScores.filter(score => score.student_id === studentId);
    this.filteredScores.forEach(score => {
      this.exam.getExamById(score.exam_id).subscribe(exam => {
        score.examName = exam.name;
      });
    })
  });
  }

  toggleStudentsDisplay(selectedClass: ClassListData): void {
    this.selectedClass = this.selectedClass === selectedClass ? null : selectedClass;
  }

  editClass(classData: ClassListData) {
    this.showCreateClassForm = true;
    this.editingClass = classData;
    this.createClassForm.setValue({
      name: classData.name,
      is_active: classData.is_active,
      year: classData.year,
      school_id: this.storage.getSessionEntry('school_id'),
      teacher_id: classData.teacher_id
    });
  }

  numberValidator(control: FormControl): {[key: string]: any} | null {
    const valid = /^\d+$/.test(control.value);
    return valid ? null : { 'notANumber': true };
  }

  createClass() {
    const isAdmin = this.storage.getSessionEntry('is_admin');
    const schoolId = this.storage.getSessionEntry('school_id');
    if (this.createClassForm?.valid) {
      if (this.editingClass) {
        // Bearbeitungslogik
        console.log('Klasse aktualisieren:', this.createClassForm.value);
        this.schoolClassService.editSchoolClass(this.editingClass.ID, this.createClassForm.value).subscribe(() => {
          if(isAdmin === true) {
          this.schoolClassService.getAllSchoolClassesArray().subscribe((classesArray) => {
            this.classes = classesArray;
          });
        }
          if(isAdmin === false) {
            this.schoolClassService.getAllSchoolClassesArrayById(schoolId).subscribe((classesArray) => {
              this.classes = classesArray;
            });
          }
        });
      } else {
        // Erstellungslogik
        console.log('Neue Klasse:', this.createClassForm.value);
        this.schoolClassService.createSchoolClass(this.createClassForm.value).subscribe(() => {
          if(isAdmin === true) {
            this.schoolClassService.getAllSchoolClassesArray().subscribe((classesArray) => {
              this.classes = classesArray;
            });
          }
            if(isAdmin === false) {
              this.schoolClassService.getAllSchoolClassesArrayById(schoolId).subscribe((classesArray) => {
                this.classes = classesArray;
              });
            }
        });
      }
      this.showCreateClassForm = false;
    }
  }


  deleteClass(classId: number) {
    const isAdmin = this.storage.getSessionEntry('is_admin');
    const schoolId = this.storage.getSessionEntry('school_id');
    this.schoolClassService.deleteSchoolClass(classId).subscribe(() => {
      if(isAdmin === true) {
        this.schoolClassService.getAllSchoolClassesArray().subscribe((classesArray) => {
          this.classes = classesArray;
        });
      }
        if(isAdmin === false) {
          this.schoolClassService.getAllSchoolClassesArrayById(schoolId).subscribe((classesArray) => {
            this.classes = classesArray;
          });
        }
    })
  }
}
