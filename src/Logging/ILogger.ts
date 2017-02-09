export interface ILogger {
	info(msg: string|Object, data?: any): void;
	warn(msg: string|Object, data?: any): void;
	error(msg: string|Object, data?: any): void;
	log(level: string|number, msg: string|Object, data?: any);
}