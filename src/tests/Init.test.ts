import * as mock from "mock-require";
import { dirname } from "path";
import * as mock_fs from "mock-fs";
import * as mocha from "mocha";

process.env.APP_ENV = "testing";

before(function () {
	mock(dirname(require.main.filename) + "/config/test.config.js", {});
	mock(dirname(require.main.filename) + "/config/test2.config.js", {});
	let configDir = `${dirname(require.main.filename)}/config`;
	let directory = {
		'app': {/** another empty directory */ }
	};
	directory[configDir] = {
		'a-file.txt': 'file content here',
		'test2.config.js': 'stuff',
		'test1.config.js': 'stuff',
		'Services': {
			'another-file.txt': 'some more content'
		}
	};
	mock_fs(directory);
});

after(function () {
	mock.stopAll();
	mock_fs.restore();
});