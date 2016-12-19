"use strict";

var changed = require('gulp-changed'),
		ts = require("gulp-typescript"),
		gulp = require("gulp");

gulp.task('default', ['ts'], function(){
	gulp.watch('src/**/*', ['ts']);
});

gulp.task('ts', function(){
	gulp.src("src/**/*.ts")
		.pipe(ts({
			"target": "es6",
			"module": "commonjs",
			"moduleResolution": "node",
			"sourceMap": true,
			"emitDecoratorMetadata": true,
			"experimentalDecorators": true,
			"removeComments": false,
			"noImplicitAny": false
		}))
		.pipe(gulp.dest("dist/"));
});

gulp.task('clean', function(){
	
});