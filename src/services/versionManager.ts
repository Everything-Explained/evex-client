

const versions = [] as string[];


export function useVersionManager(currentVer?: string) {
  const versions =
    (currentVer == undefined)
      ? getVersions() : addVersion(currentVer)
  ;
  let pos = versions.length - 1;
  return {
    version:  versions[pos],
    versions: versions.slice(),
    next:     () => (pos - 1 < 0) ? versions[--pos] : undefined,
    reset:    () => void(pos = versions.length - 1),
    addVersion,
  };
}


function getVersions() {
  const verData  = localStorage.getItem('versions');
  if (verData)
    versions.push(...verData.split(','))
  ;
  return versions;
}


function addVersion(version: string) {
  if (versions.includes(version)) return versions
  ;
  versions.push(version);
  if (versions.length > 5) versions.shift()
  ;
  localStorage.setItem('versions', versions.join(','));
  return versions;
}