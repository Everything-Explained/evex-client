export function useURI(str: string) {
  return str
    .toLowerCase()
    .replaceAll(/\s/, '-')
    .replaceAll('α', 'a')
    .replaceAll(/[^a-z0-9-]+/, '')
  ;
}