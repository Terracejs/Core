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
	public async LoadServices(): Promise<boolean> {
		return undefined;
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

	private loadEnv(): void {
		env.config({silent: true});
	}

	private initialize(): void {
		// TODO: Create config loader class
	}
}