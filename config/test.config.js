"use strict";

let env = require("../dist/HelperFunctions").env;
module.exports = {
	test: env("TEST_VAR", "test123")
};