export function enumValueValidator<T extends object>(
  value: string | undefined,
  enumObject: T,
): T[keyof T] | null {
  if (Object.values(enumObject).includes(value as T[keyof T]))
    return value as T[keyof T];

  return null;
}
