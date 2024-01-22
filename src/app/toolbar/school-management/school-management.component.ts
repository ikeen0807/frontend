import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { UiService } from '../../services/ui.service';
import { StorageService } from '../../services/storage.service';
import { ViewChild } from '@angular/core';
import { SchoolService } from '../../services/school.service';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-school-management',
  standalone: true,
  imports: [FormsModule, MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './school-management.component.html',
  styleUrl: './school-management.component.scss'
})
export class SchoolManagementComponent implements OnInit {

	public schoolSelect = new FormControl('', null);
	public school: any;
	public schoolList: any;

	@ViewChild('schoolDialogContent') schoolDialogContent?: TemplateRef<any>;

	constructor(
		private storage: StorageService,
		private event: EventService,
		private ui: UiService,
    private schoolService: SchoolService
	) { }


  ngOnInit() {

    // Mock-Werte für die Filterung
    const mockTeacherId = 2;
    const mockSchoolId = 3;

    if (this.storage.getSessionEntry('user')) {
      if(this.storage.getSessionEntry('is_admin') === true) {
        this.schoolService.getAllSchools().subscribe((schools) => {
          if (schools && Array.isArray(schools)) {
            this.schoolList = schools.map(school => school.name);
            this.storage.setSessionEntry('schoolList', this.schoolList);
            if (!this.schoolList.includes(this.storage.getSessionEntry('school'))) {
              this.storage.deleteSessionEntry('school');
              this.openSchoolSelector();
            }
          } else {
            console.error('Unerwartete Antwortstruktur:', schools);
            // Geeignete Fehlerbehandlung
          }
        });
      }
      if(this.storage.getSessionEntry('is_admin') === false) {
        this.schoolService.getAllSchools().subscribe((schools) => {
          if (schools && Array.isArray(schools)) {
            // Filtern Sie Schulen, die mindestens einen Benutzer mit mockTeacherId und mockSchoolId haben
            const filteredSchools = schools.filter(school =>
              school.users.some(user =>
                user.ID === mockTeacherId && user.school_id === mockSchoolId));

            // Extrahieren Sie nun die Namen der gefilterten Schulen
            this.schoolList = filteredSchools.map(school => school.name);
            this.storage.setSessionEntry('schoolList', this.schoolList);

            if (!this.schoolList.includes(this.storage.getSessionEntry('school'))) {
              this.storage.deleteSessionEntry('school');
              this.openSchoolSelector();
            }
          } else {
            console.error('Unerwartete Antwortstruktur:', schools);
            // Geeignete Fehlerbehandlung
          }
        });
      }
    }

		this.event.schoolChange$.subscribe((school) => {
			this.storage.setSessionEntry('school', school);
		});
	}

	public openSchoolSelector(): void {
		const dialogData = {
			headline: 'Schule auswählen',
			content: this.schoolDialogContent
		};
		this.schoolSelect.setValue(this.school);
		this.ui.openDialog(dialogData, { disableClose: true }, (confirmed:any) => {
			if (confirmed) {
				if (this.schoolSelect.value == ' ') {
					this.openSchoolSelector();
				}
				this.setSchool(this.schoolSelect);
			}
		});
	}

	public setSchool(school: any): void {
		if (!school.value) {
			this.openSchoolSelector();
			return;
		}
		this.school = school.value;
		this.event.schoolChange$.next(school.value);
		this.event.resetForm$.next();
    this.storage.setSessionEntry('school', school.value);
	}

	public hasSchool(): boolean {
		return this.school !== null;
	}
}
