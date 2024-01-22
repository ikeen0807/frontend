import { StudentService } from '../services/student.service';
import { Component, OnInit } from '@angular/core';
import { ClassListData } from '../interfaces/class-list-data.interface';
import { CommonModule } from '@angular/common';
import { SchoolStudentData } from '../interfaces/school-student-data.interface';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent implements OnInit {
  students: Array<SchoolStudentData> = [];
  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.studentService.getAllStudents().subscribe((studentsArray) => {
      this.students = studentsArray; // Direkte Zuweisung des Antwort-Arrays
    });
}


  editClass(studentData: SchoolStudentData) {
    console.log('Bearbeiten:', studentData);
    // Implementieren Sie die Bearbeitungslogik
  }

  deleteClass(classId: number) {
    console.log('Löschen:', classId);
    // Implementieren Sie die Löschlogik
  }
}
