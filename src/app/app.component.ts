import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { StorageService } from './services/storage.service';
import { EventService } from './services/event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoginComponent, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  logoutErrorSubscription?: Subscription;
	logoutUserSubscription?: Subscription;
	loginSubscription?: Subscription;
	loadingSubscription?: Subscription;
  constructor(private router: Router, private storage: StorageService, private event: EventService) {}
ngOnInit(): void {
  if(this.storage.getSessionEntry('isLoggedIn') === false) {
    this.router.navigate(['']);
  }
  this.handleLoginEvents();
  this.handleLogoutEvents();
}

ngOnDestroy(): void {
  this.logoutErrorSubscription?.unsubscribe();
  this.logoutUserSubscription?.unsubscribe();
  this.loginSubscription?.unsubscribe();
  this.loadingSubscription?.unsubscribe();
}

private handleLoginEvents() {
  this.loginSubscription = this.event.login$.subscribe((login) => {});
}

private handleLogoutEvents() {
  this.logoutUserSubscription = this.event.logoutHard$.subscribe(() => {
    this.router.navigateByUrl('/login');
  });
}
}
