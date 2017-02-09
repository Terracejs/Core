export interface ILogger {
	info(msg: string|object, data?: any): void;
	warn(msg: string|object, data?: any): void;
	error(msg: string|object, data?: any): void;
	log(level: string|number, msg: string|object, data?: any);
}