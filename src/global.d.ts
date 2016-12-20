declare module NodeJS {
	interface Global {
		app_path(): string;
		storage_path(): string;
		public_path(): string;
		env(variableName: string, defaultValue: string): any;
		randomString(length: number, chars: string): string;
		getFiles(dir: string, done: (err: Error, results: Array<string>) => void): void;
		config(configName: string): any; // TODO: Implement this
	}
}
