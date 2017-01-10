/*import * as assert from "assert";
import ConfigLoader from "../src/ConfigLoader";

describe("ConfigLoader Tests", function () {
	before(function (done) {
		let reader = ConfigLoader.Instance;
		reader.once('loaded', function(){
			done();
		});

		reader.on("error", function(err){
			done(err);
		});
	});

	describe("Instance", function () {
		it("Returns an instance of the class", function () {
			assert.equal(true, ConfigLoader.Instance instanceof ConfigLoader);
		});
	});

	describe("test123", function () {
		it("does stuff", function () {
			console.log(ConfigLoader.Instance.get(""))
		});
	});
});*/