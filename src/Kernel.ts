import * as cluster from "cluster";
import * as env from "dotenv";
import { EventEmitter } from "events";

import { IService, IServiceDetails } from "./Services/IService";
import * as Helpers from "./HelperFunctions";
import ConfigLoader from "./ConfigLoader";
import { ILogger } from "./Logging/ILogger";

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
	private _logger: ILogger;

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

		if (this._initialized) {
		}
		return false;
	}

	/**
	 * Log the data at the info level
	 * 
	 * @param {string|object} msg The message to log
	 * @param {any} data The data to log;
	 */
	public info(msg: string|object, data?:any): void {
		this.log('info', msg, data);
	}
	
	/**
	 * Log the data at the warn level
	 * 
	 * @param {string|object} msg The message to log
	 * @param {any} data The data to log;
	 */
	public warn(msg: string|object, data?:any): void {
		this.log('info', msg, data);
	}
	
	/**
	 * Log the data at the error level
	 * 
	 * @param {string|object} msg The message to log
	 * @param {any} data The data to log;
	 */
	public error(msg: string|object, data?:any): void {
		this.log('info', msg, data);
	}
	
	/**
	 * Log the data at the specfied level
	 * 
	 * @param {string|object} msg The message to log
	 * @param {any} data The data to log;
	 */
	public log(level: string|number, msg: string|object, data?:any) {
		this._logger.log(level, msg, data);
	}

	/**
	 * Start all loaded services
	 * 
	 * @returns {Promise<boolean>} Whether the services started or not
	 */
	private async StartServices(): Promise<boolean> {
		let failed = false;

		for (let service of this._services.values()) {
			if (!await this.StartService(service)) {
				failed = true;
				break;
			}
		}

		if (failed) {
			await this.StopServices();

			return false;
		}

		return true;
	}

	/**
	 * Start a single service
	 * 
	 * @param {IService} service The service to start
	 * @returns {Promise<boolean>} Whether the service started
	 */
	private async StartService(service: IService): Promise<boolean> {
		try {
			return service.Start();
		} catch (e) {
			// TODO: Log out the error
			return false;
		}
	}

	/**
	 * Stop all loaded services
	 * 
	 * @returns {Promise<boolean>} Whether the services were stopped
	 */
	private async StopServices(): Promise<boolean> {
		let failed = false;

		for (let service of this._services.values()) {
			if (!await this.StopService(service)) {
				failed = true;
				break;
			}
		}

		if (failed) {
			if (Helpers.env("APP_ENV", "testing") === "testing") {
				return false;
			} else {
				process.exit(0);
			}
		}

		return true;
	}

	/**
	 * Stop provided service
	 * 
	 * @param {IService} service The service to stop
	 * @returns {Promise<boolean>} Whether the service stopped
	 */
	private async StopService(service: IService): Promise<boolean> {
		try {
			return service.Stop();
		} catch (e) {
			// TODO: Log out the error
			return false;
		}
	}

	/**
	 * Load the services into memory
	 * 
	 * @returns {Promise<boolean>} Whether the services were loaded
	 */
	private async LoadServices(loader: ConfigLoader): Promise<boolean> {
		let servicesList: IServiceDetails[] = loader.get("kernel.services");

		if (!(servicesList instanceof Array))
			throw new Error("Kernel services list must be an array");

		for (let info of servicesList) {
			if (info.location === undefined) {
				info.location = `${Helpers.app_path()}/services/${info.name}.service.js`;
			}

			let service = this.LoadService(require, info);
			this._services.set(info.name, service);
		}

		return true;
	}

	/**
	 * Load a single service
	 * 
	 * @param {NodeRequireFunction} reqFun The function to require the service
	 * @param {IServiceDetails} details The service name and file location
	 * 
	 * @returns {IService} The service that was loaded
	 * @throws {Error}
	 */
	private LoadService(reqFun: NodeRequireFunction, details: IServiceDetails): IService {
		let constructor = reqFun(details.location);

		if (typeof constructor !== "function")
			throw new Error(`Service: ${details.name} is not a function`);

		if (typeof constructor.prototype.Stop !== "function")
			throw new Error(`Service: ${details.name} must implement the Stop function`);

		if (typeof constructor.prototype.Start !== "function")
			throw new Error(`Service: ${details.name} must implement the Start function`);

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