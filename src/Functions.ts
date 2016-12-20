import * as fs from "fs";
import * as filePath from "path";

/**
 * Provides the current application file path
 * 
 * @returns {string} application file path
 */
export function app_path(): string {
	return fs.realpathSync(__dirname + "/../");
}

/**
 * Provides environment variable values
 * 
 * @param {string} variableName Environment variable name
 * @param {any} defaultValue Default value if variable isn't found
 * @returns {any} The variables value
 */
export function env(variableName: string, defaultValue: any): any {
	if (process.env[variableName] !== undefined) {
		let temp = process.env[variableName];
		if (typeof temp === "string" && temp.indexOf(',') !== -1) {
			temp = temp.split(',');
		}

		return temp;
	}

	return defaultValue;
}

/**
 * Provides the current application storage directory
 * 
 * @returns {string} Application storage directory
 */
export function storage_path(): string {
	return app_path() + env('PUBLIC_DIR', '/storage');
}

/**
 * Provides the current application public directory
 * 
 * @returns {string} Application public directory
 */
export function public_path(): string {
	return app_path() + env('PUBLIC_DIR', '/public');
}

/**
 * Create a random string using the given mask
 * (a for lowercase alpha chars, A for uppercase alpha chars,
 * # for numberic chars and ! for special chars)
 * 
 * @param {integer} length The length of the string
 * @param {string} mask The characters that are available
 * @returns {string} The random string
 */
export function randomString(length: number, mask: string): string {
	let chars = '';
	if (mask.indexOf('a') > -1) chars += 'abcdefghijklmnopqrstuvwxyz';
	if (mask.indexOf('A') > -1) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if (mask.indexOf('#') > -1) chars += '0123456789';
	if (mask.indexOf('!') > -1) chars += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';

	let result = '';
	for (let i = length; i > 0; --i)
		result += mask[Math.round(Math.random() * (mask.length - 1))];

	return result;
}

/**
 * Provides an array of all files and sub-folders in a directory
 * 
 * @param {string} dir The directory to list
 * @param {Function} done Callback once everything is done
 */
export function getFiles(dir: string, done: (err: NodeJS.ErrnoException, results?: Array<string>) => void): void {
	let results = [];
	fs.readdir(dir, (err, list) => {
		if (err) return done(err);

		let pending = list.length;
		if (!pending) return done(null, results);

		list.forEach((fileName: string) => {
			let file = filePath.resolve(dir, fileName);

			fs.stat(file, (err, stat) => {
				if (stat && stat.isDirectory()) {
					getFiles(file, (err, res) => {
						results = results.concat(res);
						if (!--pending) done(null, results);
					});
				} else {
					results.push({ file, fileName });
					if (!--pending) done(null, results);
				}
			});

		});
	});
}

global.app_path = app_path;
global.storage_path = storage_path;
global.public_path = public_path;
global.env = env;
global.randomString = randomString;