import * as cluster from "cluster";
import * as env from "dotenv";
import { EventEmitter } from "events";

import { IService, IServiceDetails } from "./Services/IService";
import * as Helpers from "./HelperFunctions";
import ConfigLoader from "./ConfigLoader";

/**
 * Class for initializing and managing the various
 * processes and services of the application.
 * 
 * @fires Kernel#initialized
 * @fires Kernel#loaded
 */
export default class Kernel extends EventEmitter {
	private _services: Map<string, IService>;
	private _initialized: boolean = false;

	/**
	 * Whether the Kernel is initialized
	 */
	public get initialized(): boolean { return this._initialized };

	/**
	 * Private constructor to create a singleton
	 */
	private constructor() {
		super();
		this._services = new Map<string, IService>();
	}

	public async Start(): Promise<boolean> {
		await this.Initialize(ConfigLoader.Instance);

	public constructor() {
		this.loadEnv();
		this.initialize();
	}

	/**
	 * Load the services into memory
	 * 
	 * @returns {Promise<boolean>} Whether the services were loaded
	 */
	private LoadService(reqFun: NodeRequireFunction, details: IServiceDetails): IService {
		let constructor = reqFun(details.location);
		// TODO: A little bit more error handling.
		// TODO: build a or use a DI framework.
		return new constructor();
	}

	/**
	 * Initialize the Kernel
	 */
	private Initialize(loader: ConfigLoader): Promise<void> {
		env.config({ silent: true });
		
		loader.on("error", err => {

		});

		loader.on("loaded", () => {
			this._initialized = true;
			this.emit("initialized");
		});

		return loader.load();
	}

	/**
	 * Singleton instance of the class
	 */
	private static _instance: Kernel;

	/**
	 * Get the Kernel Instance
	 * 
	 * @returns {Kernel} Kernel instance
	 */
	public static get Instance(): Kernel {
		if (this._instance === undefined) {
			this._instance = new Kernel();
	}

		return this._instance;
	}
}