import * as cluster from "cluster";
import * as env from "dotenv";

import { IService } from "./Services/IService";
import * as Functions from "./Functions";

export default class Kernel {
	private _services: Array<IService>;

	public constructor() {
		this.loadEnv();
		this.initialize();
	}

	public LoadServices(): Promise<boolean> {
		return undefined;
	}

	public StartServices(): Promise<boolean> {
		return undefined
	}

	private loadEnv(): void {
		env.config({silent: true});
	}

	private initialize(): void {
		// TODO: Create config loader class
	}
}