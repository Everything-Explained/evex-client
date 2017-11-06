import * as gulp from 'gulp';
import {CLIOptions, build as buildCLI} from 'aurelia-cli';
import transpile from './transpile';
import processPug from './process-pug';
import processCSS from './process-css';
import copyFiles from './copy-files';
import watch from './watch';
import * as project from '../aurelia.json';

let build = gulp.series(
  readProjectConfiguration,
  gulp.parallel(
    transpile,
    processPug,
    // processCSS,
    copyFiles
  ),
  writeBundles
);

let main;

if (CLIOptions.taskName() === 'build' && CLIOptions.hasFlag('watch')) {
  main = gulp.series(
    build,
    (done) => { watch(null); done(); }
  );
} else {
  main = build;
}

function readProjectConfiguration() {
  return buildCLI.src(project);
}

function writeBundles() {
  return buildCLI.dest();
}

export { main as default };
