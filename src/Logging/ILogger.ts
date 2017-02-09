export interface ILogger {
	log(level: string|number, msg: string|Object, data?: any);
}