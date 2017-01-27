import * as assert from "assert";
import { Mock, Times } from "typemoq";
import Kernel from "../Kernel";
import ConfigLoader from "../ConfigLoader";
import { IService } from "../Services/IService";

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

		it("Errors on loading the service class", function () {
			let kernel =  Kernel.Instance;
			let reqFun = function (id: string): any {
				throw new Error("This should be thrown");
			}

			assert.throws(kernel["LoadService"]);
		});
	});
});