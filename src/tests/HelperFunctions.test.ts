import * as assert from "assert";
import * as mocha from "mocha";
import { dirname } from "path";
import { public_path, app_path, env, storage_path, get_files } from "../HelperFunctions";

describe("Helper Function Tests", function () {
	describe("app_path", function () {
		it("Should return current path", function () {
			assert.equal(dirname(require.main.filename), app_path());
		});
	});

	describe("env", function () {

		it("Should return test123 for TEMP_VARIABLE", function () {
			process.env["TEMP_VARIABLE"] = "test123";
			assert.equal("test123", env("TEMP_VARIABLE"));
			delete process.env["TEMP_VARIABLE"];
		});

		it("Should return default value for missing variable", function () {
			assert.equal("default", env("MISSING_VARIABLE", "default"));
		});

		it("Should split comma delimited strings", function () {
			process.env["TEMP2_VARIABLE"] = "test1,test2,test3";
			let values = env("TEMP2_VARIABLE");
			assert.equal(3, values.length);
			assert.equal("test1", values[0]);
			assert.equal("test2", values[1]);
			assert.equal("test3", values[2]);
			delete process.env["TEMP2_VARIABLE"];
		});

	});

	describe("storage_path", function () {
		it("Should return app_path + storage", function () {
			let path = dirname(require.main.filename) + "/storage";
			assert.equal(path, storage_path());
		});

		it("Should return app_path + STORAGE_DIR env value", function () {
			process.env["STORAGE_DIR"] = "/test123";
			let path = dirname(require.main.filename) + "/test123";
			assert.equal(path, storage_path());
			delete process.env["STORAGE_DIR"];
		});
	});

	describe("public_path", function () {
		it("Should return app_path + public", function () {
			let path = dirname(require.main.filename) + "/public";
			assert.equal(path, public_path());
		});

		it("Should return app_path + PUBLIC_DIR env value", function () {
			process.env["PUBLIC_DIR"] = "/test123";
			let path = dirname(require.main.filename) + "/test123";
			assert.equal(path, public_path());
			delete process.env["PUBLIC_DIR"];
		});
	});

	describe("get_files", function () {
		it("Lists all files in the config dir", async function () {
			let results = await get_files(`${dirname(require.main.filename)}/config`),
				length = results.length;

			assert.equal(4, results.length);
		});

		it("Should throw an error on missing directory", async function () {
			try {
				let results = await get_files(`${dirname(require.main.filename)}/missing`);
			} catch (e) {
				assert.equal(true, e instanceof Error);
			}
		});

		it("Should filter by filename", async function () {
			let results = await get_files(`${dirname(require.main.filename)}/config`, /a-file\.txt/),
				length = results.length;
			assert.equal(1, length);
		});
	});
});