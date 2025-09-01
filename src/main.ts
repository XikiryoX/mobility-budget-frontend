import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';

// Register locale data
registerLocaleData(localeNl, 'nl');
registerLocaleData(localeFr, 'fr');
registerLocaleData(localeEn, 'en');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
