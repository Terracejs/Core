/**
 * Interface for services
 */
export interface IService {
	/**
	 * Start the service running
	 */
	Start(): Promise<boolean>;

	/**
	 * Stop the service
	 */
	Stop(): Promise<boolean>;

	/**
	 * Whether the service is currently running
	 */
	Running: boolean;
}