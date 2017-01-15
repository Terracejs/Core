import { task, watch, src, dest } from 'gulp';
import * as path from 'path';

import { DIST_ROOT, PROJECT_ROOT, SOURCE_ROOT, LICENSE_BANNER } from "../constants";
import { tsBuildTask, copyTask, buildSequence } from "../taskHelpers";

task(':build:src:ts', tsBuildTask(SOURCE_ROOT));

task(':build:tests:ts', tsBuildTask(SOURCE_ROOT, "tsconfig-dev.json"));

task(':build:copy:assets', copyTask([
	path.join(DIST_ROOT, '**/*.!(ts)'),
	path.join(PROJECT_ROOT, 'README.md'),
	path.join(PROJECT_ROOT, 'LICENSE')
], DIST_ROOT));

task('build:development', [':build:src:ts', ':build:tests:ts']);

task('build:production', buildSequence('clean', [
	':build:src:ts', ':build:copy:assets'
]));
