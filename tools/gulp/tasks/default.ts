import { task } from 'gulp';
const gulp = require('gulp');

task('default', ['help']);

task('help', function () {
	let taskList = Object.keys(gulp.tasks)
		.filter(name => !name.startsWith(':'))
		.filter(name => name !== 'default')
		.sort();

		console.log(`\nAvailable root tasks:\n    ${taskList.join('\n    ')}`);
});