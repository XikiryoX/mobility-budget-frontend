import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'nl' | 'fr' | 'en';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLanguageSubject = new BehaviorSubject<Language>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor() {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
    
    if (savedLanguage && ['nl', 'fr', 'en'].includes(savedLanguage)) {
      this.setLanguage(savedLanguage);
    } else {
      this.detectBrowserLanguage();
    }
  }

  private detectBrowserLanguage(): void {
    const browserLang = navigator.language.toLowerCase();
    
    if (browserLang.startsWith('nl') || browserLang.startsWith('be-nl')) {
      this.setLanguage('nl');
    } else if (browserLang.startsWith('fr') || browserLang.startsWith('be-fr')) {
      this.setLanguage('fr');
    } else {
      this.setLanguage('en');
    }
  }

  public setLanguage(language: Language): void {
    this.currentLanguageSubject.next(language);
    localStorage.setItem('preferredLanguage', language);
    
    // Update document locale for Angular i18n
    document.documentElement.lang = language;
    
    // Trigger locale change for Angular i18n
    this.updateLocale(language);
  }

  private updateLocale(language: Language): void {
    // This will be used to trigger locale changes in Angular i18n
    // The actual locale switching will be handled by the build system
    console.log(`Locale changed to: ${language}`);
  }

  public getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  public getAvailableLanguages(): { code: Language; name: string; flag: string }[] {
    return [
      { code: 'nl', name: 'Nl', flag: '🇧🇪' },
      { code: 'fr', name: 'Fr', flag: '🇧🇪' },
      { code: 'en', name: 'En', flag: '🇬🇧' }
    ];
  }

  // This method will be used during the transition period
  // It provides backward compatibility with the old translation service
  public translate(key: string): string {
    // For now, return the key as fallback
    // This will be replaced by Angular i18n $localize function
    console.warn(`Translation key used: ${key}. Please migrate to Angular i18n.`);
    return key;
  }
}
