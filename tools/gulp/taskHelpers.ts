import * as gulp from "gulp";
import * as path from "path";
import * as gulpTs from "gulp-typescript";
import * as fs from "fs";

import { PROJECT_ROOT, DIST_ROOT } from "./constants";

import gulpClean = require('gulp-clean');
import gulpSourcemaps = require("gulp-sourcemaps");
import merge2 = require("merge2");
import sequence = require("run-sequence");
import mocha = require("gulp-mocha");

function _globify(maybeGlob: string, suffix = '**/*') {
	if (maybeGlob.indexOf('*') != -1) {
		return maybeGlob;
	}
	try {
		const stat = fs.statSync(maybeGlob);
		if (stat.isFile()) {
			return maybeGlob;
		}
	} catch (e) { }
	return path.join(maybeGlob, suffix);
}

export function cleanTask(glob: string) {
	return () => gulp.src(glob, { read: false }).pipe(gulpClean(null));
}

export function mochaTask(glob: string | string[]) {
	if (typeof glob === 'string') {
		return () => gulp.src(_globify(glob), { read: false })
			.pipe(mocha());
	} else {
		return () => gulp.src(glob.map(glob => _globify(glob)), { read: false })
			.pipe(mocha());
	}
}

export function tsBuildTask(configPath: string, configName = 'tsconfig.json') {
	let configDir = configPath;
	if (fs.existsSync(path.join(configDir, configName))) {
		configPath = path.join(configDir, configName);
	} else {
		configDir = path.dirname(configDir);
	}

	return () => {
		const tsConfig: any = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		const dest: string = path.join(configDir, tsConfig['compilerOptions']['outDir']);

		const tsProject = gulpTs.createProject(configPath);

		let source = tsProject.src()
			.pipe(gulpSourcemaps.init())
			.pipe(tsProject());

		let dts = source.dts.pipe(gulp.dest(dest));

		return merge2([
			dts,
			source
				.pipe(gulpSourcemaps.write('.'))
				.pipe(gulp.dest(dest))
		]);
	}
}

export function copyTask(srcDir: string | string[], outDir: string) {
	if (typeof srcDir === 'string') {
		return () => gulp.src(_globify(srcDir)).pipe(gulp.dest(outDir));
	} else {
		return () => gulp.src(srcDir.map(glob => _globify(glob))).pipe(gulp.dest(outDir));
	}
}

export function buildSequence(...args: any[]) {
	return (done: any) => {
		sequence(
			...args,
			done
		);
	};
}