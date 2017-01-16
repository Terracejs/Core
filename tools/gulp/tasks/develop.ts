import { task, watch } from "gulp";
import * as path from "path";

import { SOURCE_ROOT, DIST_ROOT } from "../constants";
import { buildSequence, mochaTask, tsBuildTask } from "../taskHelpers";

task(":watch:source", [":build:src:ts"], () => {
	watch([
		path.join(SOURCE_ROOT, "**/*.ts"),
		`${path.join(SOURCE_ROOT, "**/*.test.ts")}`
	], [":build:src:ts"]);
});

task(":watch:tests", [":build:tests:ts"], () => {
	watch(
		[path.join(SOURCE_ROOT, "**/*.test.ts")],
		[":build:tests:ts"]
	);
});

task(":watch:tests:run", [":build:tests:ts"], () => {
	watch(
		[path.join(SOURCE_ROOT, "**/*.test.ts")],
		[":build:tests:ts", "run:tests"]
	);
});

task("run:tests", [":build:tests:ts", ":build:src:ts"],
	mochaTask(path.join(SOURCE_ROOT, "**/*.test.ts")));

task("watch:full", [":watch:source", ":watch:tests"]);

task("watch:full:tests", buildSequence(
	[":watch:source", ":watch:tests:run"],
	"run:tests")
);

task("watch:source", [":watch:source"]);