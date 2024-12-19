export enum LanguageCode {
  EN = 'en',
  PL = 'pl',
}

export enum LanguageLabelKey {
  EN = 'header.LANGUAGE_EN',
  PL = 'header.LANGUAGE_PL',
}

export enum Locale {
  EN = 'en-US',
  PL = 'pl-PL',
}

export interface Language {
  code: LanguageCode;
  labelKey: LanguageLabelKey;
  locale: Locale;
}
