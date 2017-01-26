import { basename } from "path";
import { EventEmitter } from "events";
import { env, config_path, get_files, FileResult } from "./HelperFunctions";

/**
 * Class for loading configs into the
 * system. This class is a singleton.
 * 
 * @fires ConfigLoader#loaded
 * @fires ConfigLoader#error
 */
export default class ConfigLoader extends EventEmitter {
	/**
	 * The location of the configuration files
	 */
	private _configDir: string = config_path();

	/**
	 * 
	 */
	private _configs: Map<string, any>;

	/**
	 * Whether the loader is done loading
	 */
	private _loaded: boolean = false;

	/**
	 * Private constructor to create a singleton
	 */
	private constructor() {
		super();
		this._configs = new Map<string, any>();
	}

	/**
	 * Load the configuration files
	 * 
	 * @fires ConfigLoader#loaded
	 * @fires ConfigLoader#error
	 * @returns {Promise<void>} Empty Promise
	 */
	public async load(): Promise<void> {
		try {
			let fileList: Array<FileResult> = await this.getFileList();

			for (let file of fileList) {
				let data = this.readFile(file.fileName);
				let namespace = basename(file.fileName).replace(".config.js", "");

				this._configs.set(namespace, data);
			}

			/**
			 * Loaded event.
			 * 
			 * @event ConfigLoader#loaded
			 */
			this.emit("loaded");

			this._loaded = true;
		} catch (err) {
			this.emit("error", err);
		}
	}

	/**
	 * Get the list of config files
	 * 
	 * @returns {Promise<Array<FileResults>>} 
	 */
	private async getFileList(): Promise<Array<FileResult>> {
		return await get_files(this._configDir, /\.config\.js/);
	}

	/**
	 * Read the list of files and pull their data
	 * 
	 * @param {FileResult} fileList The list of files to read
	 * 
	 * @returns {Object} The data in the config files
	 */
	private readFile(fileName: string): Object {
		return require(fileName);
	}

	/**
	 * Get the value from the config
	 * 
	 * @param {any} obj Either the object to find the value or the value
	 * @param {Array<string>} path The namespace path to the value
	 * @param {number} index The current index in the path
	 * 
	 * @throws {TypeError}
	 * 
	 * @returns The value of the config
	 */
	private getValue(obj: any, path: Array<string>, index: number): any {
		if (index === path.length) {
			return obj;
		} else {

			if (obj instanceof Object) {

				if (obj instanceof Array) {
					let tempIndex = Number.parseInt(path[index]);

					if(!Number.isNaN(tempIndex) && (<Array<any>>obj).length > tempIndex){
						
						return this.getValue((<Array<any>>obj)[tempIndex], path, index + 1);

					} else {
						throw new TypeError(`Index must be an integer: ${index}`);
					}
					
				} else if((<Object>obj).hasOwnProperty(path[index])){
					
					return this.getValue((<Object>obj)[path[index]], path, index + 1);

				} else {
					throw new TypeError(`Path can't be followed: ${path.join(".")}`);
				}

			} else {
				throw new TypeError(`Path can't be followed: ${path.join(".")}`);
			}

		}
	}

	/**
	 * @param {string} name Config name to get
	 * 
	 * @throws {ReferenceError|TypeError}
	 * @returns {any}
	 */
	public get(name: string, value?: any): any {
		let namespace = name.split("."),
			obj = namespace[0];

		if(this._configs.has(obj)) {
			return this.getValue(this._configs.get(obj), namespace, 1);
		} else {
				throw new ReferenceError(`${obj} doesn't exists`);
		}
	}

	/**
	 * Whether the loader is done loading
	 */
	public get Loaded(): boolean {
		return this._loaded;
	}

	/**
	 * Singleton instance of the class
	 */
	private static _instance: ConfigLoader;

	/**
	 * Get the ConfigLoader instance
	 * 
	 * @returns {ConfigLoader} Config loader instance
	 */
	public static get Instance(): ConfigLoader {
		if (this._instance === undefined) {
			this._instance = new ConfigLoader();
		}

		return this._instance;
	}
}