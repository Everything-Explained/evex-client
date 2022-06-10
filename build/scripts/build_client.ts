import { build } from 'vite';
import { src, dest } from 'gulp';
import del from 'del';

const root = '..';
const distDir = `${root}/dist`;
const releaseDir = `${root}/release`;

/**
 * Uses Vite to build a Vue project at the web client dir,
 * in production mode; built files are created in
 * `../<webclient>/dist`
 */
export function compileClient() {
  return build({
    root,
    mode: 'production',
  });
}

/** Copies all client files to the release dir */
export function copyClient() {
  return src(`${distDir}/**`).pipe(dest(`${releaseDir}/web_client`));
}


/** Deletes all files in the client release dir */
export function cleanClient() {
  return del([
    `${releaseDir}/web_client/**`,
    `!${releaseDir}/web_client`,
    `!${releaseDir}/web_client/version.txt`,
    `!${releaseDir}/web_client/_data`
  ], { force: true });
}