import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class EventService {
	public documentClick$ = new Subject<Element>();
	public documentKeypress$ = new Subject<Element>();

	public loading$ = new Subject<boolean>();
	public componentDeactivated$ = new Subject<boolean>();

	public login$ = new Subject<boolean>();
	public logout$ = new Subject<void>();
	public logoutHard$ = new Subject<void>();
	public logoutSoft$ = new Subject<void>();

	public resetForm$ = new Subject<void>();
	public resetFocus$ = new Subject<void>();

  public schoolClassChange$: ReplaySubject<void> = new ReplaySubject();
	public schoolChange$: ReplaySubject<void> = new ReplaySubject();

	public startLoading(): void {
		this.loading$.next(true);
	}

	public stopLoading(): void {
		this.loading$.next(false);
	}

	public deactivateComponent(): void {
		this.componentDeactivated$.next(true);
	}

	public activateComponent(): void {
		this.componentDeactivated$.next(false);
	}

	public logoutHard(): void {
		this.logoutHard$.next();
		this.logout$.next();
	}

	public logoutSoft(): void {
		this.logoutSoft$.next();
		this.logout$.next();
	}
}
