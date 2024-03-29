import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { UiService } from '../../services/ui.service';
import { StorageService } from '../../services/storage.service';
import { ViewChild } from '@angular/core';
import { SchoolClassService } from '../../services/school-class.service';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-school-class-management',
  standalone: true,
  imports: [FormsModule, MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './school-class-management.component.html',
  styleUrl: './school-class-management.component.scss'
})
export class schoolClassManagementComponent implements OnInit {
	public schoolClassSelect = new FormControl('', null);
	public schoolClass: any;
	public schoolClassList: any;

	@ViewChild('schoolClassDialogContent') schoolClassDialogContent?: TemplateRef<any>;

	constructor(
		private storage: StorageService,
		private event: EventService,
		private ui: UiService,
    private schoolClassService: SchoolClassService
	) { }


  ngOnInit() {

    // Mock-Werte für die Filterung
    const mockTeacherId = this.storage.getSessionEntry('teacher_id'); /// 2
    const mockSchoolId = this.storage.getSessionEntry('school_id'); /// 3

    this.schoolClass = this.storage.getLocalEntry('schoolClass');
    this.schoolClassList = this.storage.getSessionEntry('schoolClassList');

    if (this.storage.getSessionEntry('user')) {

      if(this.storage.getSessionEntry('is_admin') === true) {

        this.schoolClassService.getAllSchoolClasses().subscribe((schoolClasses) => {

          if (schoolClasses && Array.isArray(schoolClasses)) {

            this.schoolClassList = schoolClasses.map(schoolClass => schoolClass.name);

            this.storage.setSessionEntry('schoolClassList', this.schoolClassList);
          if(this.storage.getSessionEntry('schoolClassList')) {
            if (!this.schoolClassList.includes(this.storage.getLocalEntry('schoolClass'))) {

              this.storage.deleteLocalEntry('schoolClass');
              this.openSchoolClassSelector();
            }
          }
          }
        });
      }
      if(this.storage.getSessionEntry('is_admin') === false) {
        this.schoolClassService.getAllSchoolClasses().subscribe((classes) => {
          if (classes && Array.isArray(classes)) {
            const filteredClasses = classes.filter(schoolClass =>
              schoolClass.teacher_id === mockTeacherId);

            this.schoolClassList = filteredClasses.map(schoolClass => schoolClass.name);
            console.log(this.schoolClass);
            this.storage.setSessionEntry('schoolClassList', this.schoolClassList);
          if(!this.storage.getSessionEntry('schoolClassList')) {
            if (!this.schoolClassList.includes(this.storage.getLocalEntry('schoolClass'))) {
              this.storage.deleteSessionEntry('schoolClass');
              this.openSchoolClassSelector();
            }
          }
          } else {
            console.error('Unerwartete Antwortstruktur:', classes);
          }
        });
      }

		}
		this.event.schoolClassChange$.subscribe((schoolClass) => {
			this.storage.setLocalEntry('schoolClass', schoolClass);
		});
	}

	public openSchoolClassSelector(): void {
		const dialogData = {
			headline: 'Klasse auswählen',
			content: this.schoolClassDialogContent
		};
		this.schoolClassSelect.setValue(this.schoolClass);
		this.ui.openDialog(dialogData, { disableClose: true }, (confirmed:any) => {
			if (confirmed) {
				if (this.schoolClassSelect.value == ' ') {
					this.openSchoolClassSelector();
				}
				this.setSchoolClass(this.schoolClassSelect);
			}
		});
	}

	public setSchoolClass(schoolClass: any): void {
		if (!schoolClass.value) {
			this.openSchoolClassSelector();
			return;
		}
		this.schoolClass = schoolClass.value;
		this.event.schoolClassChange$.next(schoolClass.value);
		this.event.resetForm$.next();
	}

	public hasSchoolClass(): boolean {
		return this.schoolClass !== null;
	}
}
