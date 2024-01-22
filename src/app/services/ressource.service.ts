import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class RessourceService {
	assetFolder = './assets/';

	public icon(filename: string): string {
		const iconFolder = `${this.assetFolder}icons/`;
		return iconFolder + filename;
	}

	public appIcon(filename: string): string {
		const iconFolder = `${this.assetFolder}manifest/icons/`;
		return iconFolder + filename;
	}

	public logo(filename: string): string {
		const iconFolder = `${this.assetFolder}img/`;
		return iconFolder + filename;
	}
}
