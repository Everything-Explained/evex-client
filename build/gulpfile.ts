

import gulp from 'gulp';
import { cleanClient, compileClient, copyClient } from './scripts/build_client';

process.env.NODE_ENV = 'production';

const task     = gulp.task;
const series   = gulp.series;

task('release',
  series(
    compileClient,
    cleanClient,
    copyClient
  )
);

task('build',
  series(compileClient)
);


