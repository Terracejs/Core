import * as cluster from "cluster";
import * as env from "dotenv";

import { IService } from "./Services/IService";
import * as Functions from "./HelperFunctions";

export default class Kernel {
	private _services: Array<IService>;

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