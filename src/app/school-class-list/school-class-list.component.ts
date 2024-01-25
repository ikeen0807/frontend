import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, FormControl } from '@angular/forms';
import { SchoolClassService } from '../services/school-class.service';
import { ClassListData } from '../interfaces/class-list-data.interface';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../services/storage.service';


@Component({
  selector: 'app-school-class-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './school-class-list.component.html',
  styleUrl: './school-class-list.component.scss'
})
export class SchoolClassListComponent implements OnInit {
  classes: Array<ClassListData> = [];
  createClassForm: FormGroup;
  editingClass: ClassListData | null = null;
  showCreateClassForm: boolean = false;

  constructor(private schoolClassService: SchoolClassService, private fb: FormBuilder, private storage: StorageService) {
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
      this.classes = classesArray;
    });
    } else {
      this.schoolClassService.getAllSchoolClassesArrayById(this.storage.getSessionEntry('school_id')).subscribe((classesArray) =>{
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
      school_id: '',
      teacher_id: ''
    });
  }

  editClass(classData: ClassListData) {
    this.showCreateClassForm = true;
    this.editingClass = classData;
    this.createClassForm.setValue({
      name: classData.name,
      is_active: classData.is_active,
      year: classData.year,
      school_id: classData.school_id,
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
