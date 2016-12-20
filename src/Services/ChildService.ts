import { IService } from "./IService";
import { Worker } from "cluster";

/**
 * Service implementation that includes
 * creating and managing child processes
 */
export abstract class ChildService implements IService {
	private _running: boolean = false;
	private _workers: Map<number, Worker>;
	protected workerLimit: number = 2;

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
	public Start(): Promise<boolean> {
		let worker: Worker;
		for (let count = 0; count < this.workerLimit; count++) {
			worker = this.startWorker();

			if(worker)
				this._workers.set(worker.process.pid, worker);
		}

		// TODO: Check that the correct number of workers were started.

		return this.begin();
	}

	/**
	 * Stop the service
	 * 
	 * @returns {Promise<boolean>} Whether the service stopped correctly
	 */
	public Stop(): Promise<boolean> {
		// TODO: Gracefully shutdown child processes
		
		return this.end();
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

	/**
	 * Start a worker process and set appropriate event handlers
	 */
	private startWorker(): Worker {
		return undefined;
	}
}
