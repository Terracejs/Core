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

	/**
	 * The name of the service
	 */
	Name: string;
}

/**
 * Interface for how to load a service
 */
export interface IServiceDetails {
	/**
	 * Service name
	 */
	name: string,

	/**
	 * Service file location. Default location in
	 * ${app_path()}/services/${IServiceDefinition.name}.service.js
	 * 
	 */
	location?: string
}