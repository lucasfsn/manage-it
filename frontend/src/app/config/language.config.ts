import { Locale as DateFnsLocale } from 'date-fns';
import { enUS, pl } from 'date-fns/locale';

export enum LanguageCode {
  EN = 'en',
  PL = 'pl',
}

export enum LanguageHeaderLabelKey {
  EN = 'header.LANGUAGE_EN',
  PL = 'header.LANGUAGE_PL',
}

export enum Locale {
  EN = 'en-US',
  PL = 'pl-PL',
}

export interface Language {
  readonly code: LanguageCode;
  readonly locale: Locale;
  readonly headerLabelKey: LanguageHeaderLabelKey;
}

export const LANGUAGES: Language[] = [
  {
    code: LanguageCode.EN,
    headerLabelKey: LanguageHeaderLabelKey.EN,
    locale: Locale.EN,
  },
  {
    code: LanguageCode.PL,
    headerLabelKey: LanguageHeaderLabelKey.PL,
    locale: Locale.PL,
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
