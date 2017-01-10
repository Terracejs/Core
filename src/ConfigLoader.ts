import { EventEmitter } from "events";
import { env, app_path, get_files, FileResult } from "./HelperFunctions";

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
	private _configDir: string = env("CONFIG_DIR", app_path() + "/config");

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
		this.load();
	}

	/**
	 * Load the configuration files
	 * 
	 * @fires ConfigLoader#loaded
	 * @fires ConfigLoader#error
	 */
	private load(): void {
		this.getFileList()
			.then(fileList => {
				return this.readFiles(fileList);
			})
			.then(fileData => {
				for (let config of fileData) {
					this.readConfig("", fileData);
				}
				/**
				 * Loaded event.
				 * 
				 * @event ConfigLoader#loaded
				 */
				this.emit("loaded");
			})
			.catch(err => {
				this.emit("error", err);
			});
	}

	/**
	 * Get the list of config files
	 */
	private getFileList(): Promise<Array<FileResult>> {
		return new Promise<Array<FileResult>>((resolve, reject) => {

		});
	}

	/**
	 * Read the list of files and pull their data
	 */
	private readFiles(fileList: Array<FileResult>): Promise<Array<Object>> {
		return new Promise((resolve, reject) => {
			let results = [];

			try {
				for (let file of fileList) {
					results.push(require(file.filePath));
				}

				resolve(results);
			} catch (e) {
				reject(e);
			}

		});
	}

	/**
	 * Parse the config data
	 */
	private readConfig(namespace: string, obj: Object): void {
		for (let i in obj) {
			if (typeof obj[i] === "object" && !Array.isArray(obj[i])) {
				this.readConfig(`${namespace}.${i}`, obj[i]);
			} else {
				this._configs.set(`${namespace}.${i}`);
			}
		}
	}

	public get(name: string): any {
		return this._configs.get(name);
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
	 */
	static get Instance(): ConfigLoader {
		if (this._instance === undefined) {
			this._instance = new ConfigLoader();
		}

		return this._instance;
	}
}