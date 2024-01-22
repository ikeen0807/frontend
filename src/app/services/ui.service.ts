import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { map, scan } from 'rxjs/operators';
import { BaseDialogData } from '../interfaces/base-dialog-data.interface';
import { EventService } from './event.service';
import { LoginComponent } from '../login/login.component';
import { BaseDialogComponent } from '../base-dialog/base-dialog.component';

@Injectable({
	providedIn: 'root'
})
export class UiService {
	spin$: Subject<boolean> = new Subject();
	private overlayRef?: OverlayRef;
	private loginDialogRef?: MatDialogRef<LoginComponent> | null;

	constructor(private overlay: Overlay, private dialog: MatDialog, private event: EventService) {
		this.spin$.asObservable().pipe(
			map((val) => (val ? 1 : -1)),
			scan((acc, one) => (acc + one >= 0 ? acc + one : 0), 0)
		).subscribe((res) => {
			if (res === 1) {
				this.showSpinner();
			} else if (res === 0 && this.overlayRef?.hasAttached()) {
				this.stopSpinner();
			}
		});
	}

	public openLoginDialog(): void {
		if (!this.loginDialogRef) {
			this.loginDialogRef = this.dialog.open(LoginComponent, {
				disableClose: true,
				hasBackdrop: true,
				backdropClass: 'dark-backdrop',
				panelClass: 'force-login-panel'
			});
		}
	}

	public closeLoginDialog(): void {
		this.loginDialogRef?.close();
		this.loginDialogRef = null;
	}

	public hasLoginDialog(): boolean {
		return !!this.loginDialogRef;
	}

	public openDialog(data: BaseDialogData, config: MatDialogConfig = {}, afterClose: any = null): void {
		// eslint-disable-next-line no-console
		console.log('Open Dialog', { data, ...config });
		this.event.deactivateComponent();
		const dialogRef = this.dialog.open(BaseDialogComponent, { data, ...config });
		if (config?.panelClass) dialogRef.addPanelClass(config.panelClass);
		dialogRef.afterClosed().subscribe((event) => {
			this.event.activateComponent();
			if (afterClose) afterClose(event);
		});
	}

	private createOverlay() {
		return this.overlay.create({
			hasBackdrop: true,
			backdropClass: 'dark-backdrop',
			positionStrategy: this.overlay
				.position()
				.global()
				.centerHorizontally()
				.centerVertically()
		});
	}

	private showSpinner() {
		if (!this.overlayRef) {
			this.overlayRef = this.createOverlay();
		}
		this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
	}

	private stopSpinner() {
		this.overlayRef?.detach();
	}
}
