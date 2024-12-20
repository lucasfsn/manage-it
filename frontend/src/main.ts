import { registerLocaleData } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { ANGULAR_LOCALES, LANGUAGES } from './app/language.config';

LANGUAGES.forEach((language) => {
  ANGULAR_LOCALES[language.code]().then((locale) => {
    registerLocaleData(locale);
  });
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
