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

export function config_path(): string {
	return app_path() + env('CONFIG_DIR', '/config');
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
 * @returns {Promise}
 */
export async function get_files(dir: string, filter?: RegExp): Promise<Array<FileResult>> {
	let results: Array<FileResult> = [];

	try {
		let files: Array<FileResult> = await readDir(dir),
			promises: Array<Promise<Array<FileResult>>> = [];

		for (let file of files) {
			if (file.stats.isDirectory()) {
				promises.push(get_files(file.fileName));
			} else {
				results.push(file);
			}
		}

		for (files of await Promise.all(promises)) {
			results = results.concat(files);
		}

	} catch (err) {
		throw err;
	}

	return results;
}

async function readDir(dir: string): Promise<Array<FileResult>> {
	return new Promise<Array<FileResult>>(async (resolve, reject): Promise<void> => {
		fs.readdir(dir, async (err, files): Promise<void> => {
			let stats: Array<FileResult> = [],
				temp: FileResult;

			if (!err) {
				try {

					for (let file of files) {
						temp = await readStat(file, dir);
						stats.push(temp);
					}

					resolve(stats);

				} catch (e) {
					reject(e);
				}
			} else {
				reject(err);
			}
		});
	});
}

async function readStat(filename: string, dir: string): Promise<FileResult> {
	return new Promise<FileResult>((resolve, reject) => {
		fs.stat(filePath.resolve(dir, filename), (err, stat) => {
			if (!err) {
				resolve({
					fileName: filePath.resolve(dir, filename),
					filePath: dir,
					stats: stat
				});
			} else {
				reject(err);
			}
		});
	});
}

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

	/**
	 * The FS stats object for the file
	 */
	stats: fs.Stats;
}