import { IService } from "./IService";
import Kernel from "../Kernel";

/**
 * Service implementation that includes
 * creating and managing child processes
 */
export abstract class ChildService implements IService {
	private _running: boolean = false;
	protected workerLimit: number = 2;
	public Name: string;

	/**
	 * Public accessor for whether the service is running
	 */
	public get Running(): boolean {
		return this._running;
	}

	public constructor() {
		this.initialize();
	}

	/**
	 * Start the service
	 * 
	 * @returns {Promise<boolean>} Whether the service started correctly
	 */
	public async Start(): Promise<boolean> {

		// TODO: Add requesting child processes from kernel
		
		return await this.begin();
	}

	/**
	 * Stop the service
	 * 
	 * @returns {Promise<boolean>} Whether the service stopped correctly
	 */
	public async Stop(): Promise<boolean> {		
		return await this.end();
	}


	/**
	 * Initializes the service
	 */
	protected abstract initialize();

	/**
	 * Begin running the service
	 */
	protected abstract begin(): Promise<boolean>;

	/**
	 * Finish running the service and perform clean-up
	 */
	protected abstract end(): Promise<boolean>;
}
