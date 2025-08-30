export function capitalize(str: string): string {
  str = str.toLocaleLowerCase();
  return str.charAt(0).toUpperCase();
}
