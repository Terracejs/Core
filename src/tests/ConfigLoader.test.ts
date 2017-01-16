import * as assert from "assert";
import * as mock_fs from "mock-fs";
import * as fs from "fs";
import * as mocha from 'mocha';
import * as mock from "mock-require";
import * as rewire from "rewire";
import { dirname } from "path";
import ConfigLoader from "../ConfigLoader";

before(function () {
	mock(dirname(require.main.filename) + "/config/test.config.js", {});
	mock(dirname(require.main.filename) + "/config/test2.config.js", {});
});

after(function () {
	mock.stopAll();
});

describe("ConfigLoader Tests", function () {
	after(function () {
		mock_fs.restore();
	});

	describe("Instance", function () {
		it("Returns an instance of the class", function () {
			assert.equal(true, ConfigLoader.Instance instanceof ConfigLoader);
		});
	});

	describe("getFileList", function () {
		it("returns all .config.js files in config dir", async function () {
			let files = await ConfigLoader.Instance["getFileList"]();
			assert.equal(2, files.length);
		});
	});

	describe("getValue", function () {
		it("Errors on invalid path", function () {
			let config = ConfigLoader.Instance;

			assert.throws(function () {
				config["getValue"](1, ["abc", "def"], 0);
			});
		});

		it("Errors if object doesn't have property", function () {
			let config = ConfigLoader.Instance;

			assert.throws(function () {
				let obj = {};
				config["getValue"](obj, ["abc", "def"], 0);
			});
		});

		it("Returns the appropriate value on object", function () {
			let config = ConfigLoader.Instance,
				obj = { testValue: "123" };

			assert.equal(obj.testValue, config["getValue"](obj, ["obj", "testValue"], 1));
		});

		it("Errors if entering an array without number index", function () {
			let config = ConfigLoader.Instance,
				obj = ["123", "456"];

			assert.throws(function () {
				config["getValue"](obj, ["asdf", "asdf"], 1);
			});
		});

		it("Returns the appropriate value on array", function () {
			let config = ConfigLoader.Instance,
				obj = ["123", "456"];
			
			assert.equal(obj[0], config["getValue"](obj, ["", "0"], 1));
		});
	});
});