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
    const mockTeacherId = 2;
    const mockSchoolId = 1;

    if (this.storage.getSessionEntry('user')) {
      if(this.storage.getSessionEntry('is_admin') === true) {
        this.schoolClassService.getAllSchoolClasses().subscribe((schoolClasses) => {
          if (schoolClasses && Array.isArray(schoolClasses)) {
            this.schoolClassList = schoolClasses.map(schoolClass => schoolClass.name);
            this.storage.setSessionEntry('schoolClassList', this.schoolClassList);
            if (!this.schoolClassList.includes(this.storage.getLocalEntry('schoolClass'))) {
              this.storage.deleteLocalEntry('schoolClass');
              this.openSchoolClassSelector();
            }
          } else {
            console.error('Unerwartete Antwortstruktur:', schoolClasses);
            // Geeignete Fehlerbehandlung
          }
        });
      }
      if(this.storage.getSessionEntry('is_admin') === false) {
        this.schoolClassService.getAllSchoolClasses().subscribe((classes) => {
          if (classes && Array.isArray(classes)) {
            // Filtern Sie Klassen basierend auf teacher_id und school_id
            const filteredClasses = classes.filter(schoolClass =>
              schoolClass.teacher_id === mockTeacherId && schoolClass.school_id === mockSchoolId);

            // Extrahieren Sie nun die Namen der gefilterten Klassen
            this.schoolClassList = filteredClasses.map(schoolClass => schoolClass.name);
            this.storage.setSessionEntry('schoolClassList', this.schoolClassList);

            if (!this.schoolClassList.includes(this.storage.getSessionEntry('schoolClass'))) {
              this.storage.deleteSessionEntry('schoolClass');
              this.openSchoolClassSelector();
            }
          } else {
            console.error('Unerwartete Antwortstruktur:', classes);
            // Geeignete Fehlerbehandlung
          }
        });
      }

		}
		this.event.schoolClassChange$.subscribe((schoolClass) => {
			this.storage.setSessionEntry('schoolClass', schoolClass);
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
    this.storage.setSessionEntry('schoolClass', schoolClass.value);
	}

	public hasSchoolClass(): boolean {
		return this.schoolClass !== null;
	}
}
