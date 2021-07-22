export function useURI(str: string) {
  return str
    .toLowerCase()
    .replace(/\s/g, '-')
    .replaceAll('α', 'a')
    .replace(/[^a-z0-9-]+/g, '')
  ;
}