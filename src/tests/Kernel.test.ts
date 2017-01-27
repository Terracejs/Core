import * as assert from "assert";
import { Mock, Times } from "typemoq";
import Kernel from "../Kernel";
import ConfigLoader from "../ConfigLoader";

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

			kernel["initialize"](config.object);

			config.verifyAll();
			assert.equal(true, kernel.initialized);
		});

		it("Errors when ConfigLoader errors", function () {
			let kernel = Kernel.Instance,
				config = Mock.ofInstance(ConfigLoader.Instance);

			config.callBase = true;
			config.setup(x => x.load())
				.callback(() => { config.object.emit("error"); })
				.verifiable(Times.once());

			kernel["initialize"](config.object);

			config.verifyAll();
			assert.equal(false, kernel.initialized);
		});
	});
});