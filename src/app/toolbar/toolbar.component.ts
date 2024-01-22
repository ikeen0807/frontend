import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { ToolbarProfileMenuComponent } from './toolbar-profile-menu/toolbar-profile-menu.component';
import { SchoolManagementComponent } from './school-management/school-management.component';
import { StorageService } from '../services/storage.service';
import { RessourceService } from '../services/ressource.service';
import { ConfigService } from '../services/config.service';
import { CommonModule } from '@angular/common';
import { schoolClassManagementComponent } from './school-class-management/school-class-management.component';
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MaterialModule, ToolbarProfileMenuComponent, SchoolManagementComponent, RouterModule, CommonModule, schoolClassManagementComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {

	public notenverwaltungLogoPath = 'notenverwaltung-logo.png';
	public featureSchool: any;
  public featureSchoolClass: any;

	@Output() sidenavClickEvent = new EventEmitter<void>();

	constructor(
		private ressource: RessourceService,
		private storage: StorageService,
		private config: ConfigService,
		private router: Router
	) {
	}

	ngOnInit(): void {
		this.featureSchool = this.config.hasSchoolManagement();
    this.featureSchoolClass = this.config.hasSchoolClassManagement();
	}

	public isLoggedIn(): unknown {
		const isLoggedIn = this.storage.getSessionEntry('isLoggedIn');
		return isLoggedIn;
	}

	public logo(name: string): string {
		return this.ressource.logo(name);
	}

  public disabledHome(): boolean {
		return true;
	}

	public toggleSidenav(): void {
		this.sidenavClickEvent.emit();
	}

	private getUser(): any {
		return this.storage.getSessionEntry('user');
	}
}
