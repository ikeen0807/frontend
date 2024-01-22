import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatMenu } from '@angular/material/menu';
import { StorageService } from '../../services/storage.service';
import { EventService } from '../../services/event.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-toolbar-profile-menu',
  standalone: true,
  imports: [MaterialModule, RouterModule],
  templateUrl: './toolbar-profile-menu.component.html',
  styleUrl: './toolbar-profile-menu.component.scss'
})
export class ToolbarProfileMenuComponent implements AfterViewInit {
	@ViewChild('menu', { static: false })	menu?: MatMenu;

	public fullName;

	constructor(
		private storage: StorageService,
		private event: EventService,
    private router: Router
	) {
		this.fullName = this.getFullName();
	}

	ngAfterViewInit(): void {
		this.menu?.closed.subscribe(() => {
			if (this.storage.getSessionEntry('user')) {
				this.event.resetFocus$.next();
			}
		});
	}

	public logout(): void {
		this.storage.clearSession();
    this.event.logoutHard();
    this.router.navigate(['']);
	}


	public dialogError(): void {}

	public getFullName() {
		return this.storage.getSessionEntry('user')?.fullName || 'No User';
	}
}

