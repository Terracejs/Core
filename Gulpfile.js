"use strict";

var changed = require('gulp-changed'),
	ts = require("gulp-typescript"),
	gulp = require("gulp"),
	tsProject = ts.createProject('tsconfig.json');

gulp.task('default', ['ts'], function () {
	gulp.watch('src/**/*', ['ts']);
});

gulp.task('ts', function () {
	gulp.src(["./src/**/*.ts", "./typings/**/*.d.ts"])
		.pipe(tsProject())
		.pipe(gulp.dest("dist/"));
});

gulp.task('clean', function () {

});