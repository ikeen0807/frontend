import { Injectable } from '@angular/core';
import appConfig from '../../config/app.json';

@Injectable({
	providedIn: 'root'
})
// TODO: return type - interface?
export class ConfigService {
	public getAppConfig(): any {
		return appConfig;
	}

	public hasSchoolManagement(): boolean {
		return appConfig.featureSchoolManagement;
	}

  public hasSchoolClassManagement(): boolean {
    return appConfig.featureSchoolClassManagement;
  }

	public getDefaultLanguage(): string {
		return appConfig.defaultLanguage || 'en';
	}


  public getAppLanguage(lang: string): string {
    const browserLanguage = appConfig.languages[lang as keyof typeof appConfig.languages];
    return browserLanguage || this.getDefaultLanguage();
  }
}
