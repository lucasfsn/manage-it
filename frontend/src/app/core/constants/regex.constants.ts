export const PASSWORD_REGEX =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

export const PERSON_NAME_REGEX =
  /^[a-zA-Z\xC0-\uFFFF]+([ \-']{0,1}[a-zA-Z\xC0-\uFFFF]+){0,2}[.]{0,1}$/;

export const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9_]{7,29}$/;
