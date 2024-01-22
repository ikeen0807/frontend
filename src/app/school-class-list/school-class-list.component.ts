import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, FormControl } from '@angular/forms';
import { SchoolClassService } from '../services/school-class.service';
import { ClassListData } from '../interfaces/class-list-data.interface';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


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
  showCreateClassForm: boolean = false;

  constructor(private schoolClassService: SchoolClassService, private fb: FormBuilder) {
    this.createClassForm = this.fb.group({
      name: ['', Validators.required],
      is_active: [false],
      year: ['', Validators.required],
      school_id: ['', [Validators.required, this.numberValidator]],
      teacher_id: ['', [Validators.required, this.numberValidator]]
    });
   }

  ngOnInit() {
    this.schoolClassService.getAllSchoolClassesArray().subscribe((classesArray) => {
      this.classes = classesArray;
    });
  }

  openCreateClassForm() {
    this.showCreateClassForm = true;
  }

  numberValidator(control: FormControl): {[key: string]: any} | null {
    const valid = /^\d+$/.test(control.value);
    return valid ? null : { 'notANumber': true };
  }

  createClass() {
    if (this.createClassForm?.valid) {
      console.log('Neue Klasse:', this.createClassForm.value);
      this.schoolClassService.createSchoolClass(this.createClassForm.value).subscribe(() => {
        this.schoolClassService.getAllSchoolClassesArray().subscribe((classesArray) => {
          this.classes = classesArray;
        });
      });
      // Zum Beispiel: this.schoolClassService.createClass(this.createClassForm.value).subscribe(...);
      this.showCreateClassForm = false;
      // Aktualisieren Sie ggf. die Klassenliste
    }
  }

  editClass(classData: ClassListData) {
    console.log('Bearbeiten:', classData);
    // Implementieren Sie die Bearbeitungslogik
  }

  deleteClass(classId: number) {
    console.log('Löschen:', classId);
    // Implementieren Sie die Löschlogik
  }
}
