import * as fs from "fs";
import * as filePath from "path";

/**
 * Provides the current application file path
 * 
 * @returns {string} application file path
 */
export function app_path(): string {
	return filePath.dirname(require.main.filename);
}

/**
 * Provides environment variable values
 * 
 * @param {string} variableName Environment variable name
 * @param {any} defaultValue Default value if variable isn't found
 * @returns {any} The variables value
 */
export function env(variableName: string, defaultValue?: any): any {
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
	return app_path() + env('STORAGE_DIR', '/storage');
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
 * ('a' for lowercase alpha chars, 'A' for uppercase alpha chars,
 * '#' for numberic chars and '!' for special chars)
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
 * Provides an array of all files and files in sub-folders in a directory
 * 
 * @param {string} dir The directory to list
 * @param {RegExp|Callback} filter Optional filter
 * @param {Callback} done Callback once everything is done
 */
export function get_files(dir: string, filter: RegExp|GetFilesCallback, done?: GetFilesCallback): void {
	if(done === undefined){
		done = (<GetFilesCallback>filter);
		filter = undefined;
	}

	let results: Array<FileResult> = [];
	try{
		fs.readdir(dir, (err, list) => {
			if (err) return done(err);

			let pending = list.length;
			if (!pending) return done(null, results);

			list.forEach((fileName: string) => {
				let file = filePath.resolve(dir, fileName);

				fs.stat(file, (err, stat) => {
					if (stat && stat.isDirectory()) {
						get_files(file, filter, (err, res) => {
							results = results.concat(res);
							if (!--pending) done(null, results);
						});
					} else {
						if(filter === undefined || (<RegExp>filter).test(file))
							results.push({ filePath: file, fileName: fileName });
						if (!--pending) done(null, results);
					}
				});

			});
		});
	} catch(err){
		done(err);
	}
}

/**
 * Describes what the callback for get_files looks like
 * 
 * @param  {NodeJS.ErrnoException|null} err The error that occurred
 * @param {Array<FileResult>} results The results of the request
 */
export type GetFilesCallback = (err: NodeJS.ErrnoException, results?: Array<FileResult>) => void;

/**
 * Describes the results from the get_files function
 */
export interface FileResult {
	/**
	 * The file path including filename of the file
	 */
	filePath: string;

	/**
	 * The name without the filepath
	 */
	fileName: string;
}