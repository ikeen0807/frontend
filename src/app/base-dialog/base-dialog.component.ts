import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDialogData } from '../interfaces/base-dialog-data.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base-dialog',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './base-dialog.component.html',
  styleUrl: './base-dialog.component.scss'
})
export class BaseDialogComponent implements OnInit {
	public headline = '';
	public text = '';
	public content = null;
	public containerClass = '';
	public confirmButtonText = '';
	public cancelButtonText = 'Okay';
	public cancelOnly = false;

	constructor(
		public dialogRef: MatDialogRef<BaseDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: BaseDialogData
	) {
	}

	ngOnInit(): void {
		this.headline = this.data.headline;
		this.text = this.data.text;
		this.content = this.data.content;
		this.containerClass = this.data.containerClass;
		this.confirmButtonText = this.data.confirmButtonText;
		this.cancelButtonText = this.data.cancelButtonText;
		this.cancelOnly = this.data.cancelOnly;
	}

	closeDialog(res: boolean): void {
		this.dialogRef.close(res);
	}
}
