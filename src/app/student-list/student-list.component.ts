import { StudentService } from '../services/student.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolStudentData } from '../interfaces/school-student-data.interface';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { SchoolClassService } from '../services/school-class.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent implements OnInit {
  students: Array<SchoolStudentData> = [];
  createStudentForm: FormGroup;
  editingStudent: SchoolStudentData | null = null;
  showCreateStudentForm: boolean = false;
  constructor(private studentService: StudentService, private storage: StorageService, private formBuilder: FormBuilder, private schoolClassService: SchoolClassService) {
    this.createStudentForm = this.formBuilder.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      address: this.formBuilder.group({
        street: ['', Validators.required],
        number: ['', Validators.required],
        postal: ['', Validators.required],
        city: ['', Validators.required],
      }),
      date_of_birth: ['', Validators.required],
      class_id: ['', [Validators.required, this.numberValidator]]
    });
  }

  ngOnInit() {
    this.studentService.getAllStudents().subscribe((studentsArray) => {
      studentsArray.forEach(student => {
        this.schoolClassService.getClassById(student.class_id).subscribe(schoolClass => {
          student.className = schoolClass.name;
        })
      })
      this.students = studentsArray; // Direkte Zuweisung des Antwort-Arrays
    });
}

openCreateStudentForm() {
  this.editingStudent = null;
  this.showCreateStudentForm = true;
  this.createStudentForm.reset({
    vorname:'',
    nachname: '',
    address: {
    street: '',
    number: '',
    postal: '',
    city: '',
    },
    date_of_birth: '',
    class_id: '',
  })
}


  editStudent(studentData: SchoolStudentData) {
   this.showCreateStudentForm = true;
   this.editingStudent = studentData;
   this.createStudentForm.setValue({
    vorname: studentData.vorname,
    nachname: studentData.nachname,
    address: {
    street: studentData.address.street,
    number: studentData.address.number,
    postal: studentData.address.postal,
    city: studentData.address.city,
    },
    date_of_birth: studentData.date_of_birth,
    class_id: studentData.class_id
   })
  }

  createStudent() {
    const isAdmin = this.storage.getSessionEntry('is_admin');
    if(this.createStudentForm?.valid) {
      if(this.editingStudent) {
        this.studentService.editStudent(this.editingStudent.ID, this.createStudentForm.value).subscribe(()=>{
          if(isAdmin === true) {
            this.studentService.getAllStudents().subscribe((studentsArray) => {
              studentsArray.forEach(student => {
                this.schoolClassService.getClassById(student.class_id).subscribe(schoolClass => {
                  student.className = schoolClass.name;
                })
              })
              this.students = studentsArray;
            })
          }
          if(isAdmin === false) {
            // TODO Implement non-Admin case
            this.studentService.getAllStudents().subscribe((studentsArray) => {
              studentsArray.forEach(student => {
                this.schoolClassService.getClassById(student.class_id).subscribe(schoolClass => {
                  student.className = schoolClass.name;
                })
              })
              this.students = studentsArray;
            })
          }
        })
      } else {
        this.studentService.createStudent(this.createStudentForm.value).subscribe(() => {
          if(isAdmin === true) {
            this.studentService.getAllStudents().subscribe((studentsArray) => {
              studentsArray.forEach(student => {
                this.schoolClassService.getClassById(student.class_id).subscribe(schoolClass => {
                  student.className = schoolClass.name;
                })
              })
              this.students = studentsArray;
            })
          }
          if(isAdmin === false) {
            // TODO Implement non Admin-case
            this.studentService.getAllStudents().subscribe((studentsArray) => {
              studentsArray.forEach(student => {
                this.schoolClassService.getClassById(student.class_id).subscribe(schoolClass => {
                  student.className = schoolClass.name;
                })
              })
              this.students = studentsArray;
            })
          }
        })
      }
      this.showCreateStudentForm = false;
    }
  }

  deleteStudent(studentId: number) {
    const isAdmin = this.storage.getSessionEntry('is_admin');
    this.studentService.deleteStudent(studentId).subscribe(() => {
      if(isAdmin === true) {
        this.studentService.getAllStudents().subscribe((studentsArray) => {
          studentsArray.forEach(student => {
            this.schoolClassService.getClassById(student.class_id).subscribe(schoolClass => {
              student.className = schoolClass.name;
            })
          })
          this.students = studentsArray;
        })
      }
      if(isAdmin === false) {
        // TODO Implement non-Admin case
        this.studentService.getAllStudents().subscribe((studentsArray) => {
          studentsArray.forEach(student => {
            this.schoolClassService.getClassById(student.class_id).subscribe(schoolClass => {
              student.className = schoolClass.name;
            })
          })
          this.students = studentsArray;
        })
      }
    })
  }

  numberValidator(control: FormControl): {[key: string]: any} | null {
    const valid = /^\d+$/.test(control.value);
    return valid ? null : { 'notANumber': true };
  }
}
