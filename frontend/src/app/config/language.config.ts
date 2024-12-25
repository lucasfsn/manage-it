import { Locale as DateFnsLocale } from 'date-fns';
import { enUS, pl } from 'date-fns/locale';

export enum LanguageCode {
  EN = 'en',
  PL = 'pl',
}

export enum LocaleCode {
  EN = 'en-US',
  PL = 'pl-PL',
}

export interface Language {
  readonly code: LanguageCode;
  readonly localeCode: LocaleCode;
}

export const LANGUAGES: Language[] = [
  {
    code: LanguageCode.EN,
    localeCode: LocaleCode.EN,
  },
  {
    code: LanguageCode.PL,
    localeCode: LocaleCode.PL,
  },
];

export const ANGULAR_LOCALES: Record<LanguageCode, () => Promise<unknown>> = {
  [LanguageCode.EN]: () =>
    import('@angular/common/locales/en').then((m) => m.default),
  [LanguageCode.PL]: () =>
    import('@angular/common/locales/pl').then((m) => m.default),
};

export const DATE_FNS_LOCALES: Record<LanguageCode, DateFnsLocale> = {
  [LanguageCode.EN]: enUS,
  [LanguageCode.PL]: pl,
};
