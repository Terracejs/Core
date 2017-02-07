import * as assert from "assert";
import { Mock, Times, It, IMock } from "typemoq";
import Kernel from "../Kernel";
import ConfigLoader from "../ConfigLoader";
import * as Helpers from "../HelperFunctions";
import { IService, IServiceDetails } from "../Services/IService";

class MockService implements IService {
	public async Start(): Promise<boolean> {
		return true;
	}

	public async Stop(): Promise<boolean> {
		return true;
	}

	public get Running(): boolean {
		return false;
	}

	public get Name(): string {
		return "MockService";
	}
}

describe("Kernel tests", function () {
	describe("Instance", function () {
		it("Returns an instance of the class", function () {
			assert.equal(true, Kernel.Instance instanceof Kernel);
		});
	});

	describe("initialize", function () {
		it("Is initialized when ConfigLoader loads", async function () {
			let kernel = Kernel.Instance,
				config = Mock.ofInstance(ConfigLoader.Instance);

			config.callBase = true;
			config.setup(x => x.load())
				.callback(() => { config.object.emit("loaded"); })
				.verifiable(Times.once());

			kernel["Initialize"](config.object);

			config.verifyAll();
			assert.equal(true, kernel.initialized);
			kernel["_initialized"] = false;
		});

		it("Errors when ConfigLoader errors", function () {
			let kernel = Kernel.Instance,
				config = Mock.ofInstance(ConfigLoader.Instance);

			config.callBase = true;
			config.setup(x => x.load())
				.callback(() => { config.object.emit("error"); })
				.verifiable(Times.once());

			kernel["Initialize"](config.object);

			config.verifyAll();
			assert.equal(false, kernel.initialized);
		});
	});

	describe("LoadService", function () {
		it("Creates new instance of the service class", function () {
			let kernel = Kernel.Instance;
			let reqFun = function (id: string): any {
				return MockService;
			}

			let service: IService = kernel["LoadService"](reqFun, { name: "Test" });
			assert.equal(true, service !== undefined);
			assert.equal(true, service instanceof MockService);
		});

		it("Errors when the loading function errors", function () {
			let kernel = Kernel.Instance;
			let reqFun = function (id: string): any {
				throw new Error("This should be thrown");
			}

			assert.throws(() => {
				kernel["LoadService"](reqFun, { location: "", name: "test" });
			},
				function (err) {
					if ((err instanceof Error) && /This should be thrown/.test(err.message)) {
						return true;
					}
				});
		});

		it("Errors when constructor isn't a function", function () {
			let kernel = Kernel.Instance;
			let reqFun = function (id: string): any {
				return {};
			}

			assert.throws(() => {
				kernel["LoadService"](reqFun, { name: "test", location: "test" });
			},
				function (err) {
					if ((err instanceof Error) && /Service: test is not a function/.test(err.message)) {
						return true;
					}
				});
		});

		it("Errors when missing Stop function", function () {
			let kernel = Kernel.Instance;
			let reqFun = function (id: string): any {
				return class Test {
					Start() { }
				}
			};

			assert.throws(() => {
				kernel["LoadService"](reqFun, { name: "test", location: "test" });
			},
				function (err) {
					if ((err instanceof Error)
						&& /Service: test must implement the Stop function/.test(err.message)) {
						return true;
					}
				});
		});

		it("Errors when missing Start function", function () {
			let kernel = Kernel.Instance;
			let reqFun = function (id: string): any {
				return class Test {
					Stop() { }
				}
			};

			assert.throws(() => {
				kernel["LoadService"](reqFun, { name: "test", location: "test" });
			},
				function (err) {
					if ((err instanceof Error)
						&& /Service: test must implement the Start function/.test(err.message)) {
						return true;
					}
				});

		});
	});

	describe("LoadServices", function () {
		beforeEach(function () {
			Kernel.Instance["_services"].clear();
		});

		it("Errors when servicesList isn't an array", async function () {
			let config = Mock.ofInstance(ConfigLoader.Instance);
			let kernel = Kernel.Instance;
			let error;

			config.setup(x => x.get("kernel.services"))
				.returns(x => { })
				.verifiable(Times.once());

			try {
				await kernel["LoadServices"](config.object);
			} catch (e) {
				error = e;
			}

			assert.equal(error instanceof Error, true);
			assert.equal(error.message, "Kernel services list must be an array");
			config.verifyAll();
		});

		it("Sets location when location is missing", async function () {
			let config = Mock.ofInstance(ConfigLoader.Instance);
			let kernel = Mock.ofInstance(Kernel.Instance);
			let service: IServiceDetails = { name: "Test" };
			let reqFun = function (id: string): any {
				return MockService;
			}

			config.setup(x => x.get("kernel.services"))
				.returns(x => [service])
				.verifiable(Times.once());

			kernel.setup(x => x["LoadService"](It.isAny(), It.isAny()))
				.returns((x, y): any => { return MockService; });
			kernel.callBase = true;

			await kernel.object["LoadServices"](config.object);

			assert.notEqual(service.location, undefined)
			assert.equal(service.location, `${Helpers.app_path()}/services/${service.name}.service.js`);

			config.verifyAll();
		});

		it("Sets the service in _services map", async function () {
			let config = Mock.ofInstance(ConfigLoader.Instance);
			let kernel = Mock.ofInstance(Kernel.Instance);

			config.setup(x => x.get("kernel.services"))
				.returns(x => [{ name: "Test" }])
				.verifiable(Times.once());

			kernel.callBase = true;
			kernel.setup(x => x["LoadService"](It.isAny(), It.isAny()))
				.returns((x, y): any => { return MockService; });

			await kernel.object["LoadServices"](config.object);
			assert.equal(kernel.object["_services"].has("Test"), true);
			config.verifyAll();
		});
	});

	describe("StartService", function () {
		it("Calls start on passed service", async function () {
			let kernel = Kernel.Instance;
			let service = Mock.ofType(MockService);

			service.setup(x => x.Start()).returns(() => Promise.resolve(true)).verifiable(Times.once());

			let result = await kernel["StartService"](service.object);

			assert.equal(result, true);
			service.verifyAll();
		});

		it("Errors on service start error", async function () {
			let kernel = Kernel.Instance;
			let service = Mock.ofType(MockService);
			let err: Error;

			service.setup(x => x.Start()).throws(new Error("This should be the error"))
				.verifiable(Times.once());

			let result = await kernel["StartService"](service.object);

			assert.equal(result, false);
			service.verifyAll();
		});
	});

	describe("StartServices", function () {
		it("Calls start on all loaded services", async function () {
			let kernel = Kernel.Instance;
			let services: IMock<MockService>[] = [];

			for (let i of [0, 1, 2, 3, 4]) {
				services.push(Mock.ofType(MockService));
				services[i].setup(x => x.Start())
					.returns(x => Promise.resolve(true))
					.verifiable(Times.once());

				kernel["_services"].set(`Test${i}`, services[i].object);
			}

			let result = await kernel["StartServices"]();

			assert.equal(result, true);

			for (let service of services) {
				service.verifyAll();
			}
		});

		it("Returns false if a service doesn't start", async function () {
			let kernel = Kernel.Instance;
			let services: IMock<MockService>[] = [];

			for (let i of [0, 1, 2, 3, 4]) {
				services.push(Mock.ofType(MockService));
				services[i].setup(x => x.Start())
					.returns(x => Promise.resolve(false))
					.verifiable(i === 0 ? Times.once() : Times.never());

				kernel["_services"].set(`Test${i}`, services[i].object);
			}

			let result = await kernel["StartServices"]();

			assert.equal(result, false);
			for (let service of services) {
				service.verifyAll();
			}
		});

		it("Calls stop on all services when failing");
	});
});