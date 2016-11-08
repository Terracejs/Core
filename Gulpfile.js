"use strict";

var changed = require('gulp-changed'),
		ts = require("gulp-typescript"),
		gulp = require("gulp");

gulp.task('global', ['ts'], function(){
	gulp.watch('src/**/*', ['ts']);
});

gulp.task('clean', function(){
	
});