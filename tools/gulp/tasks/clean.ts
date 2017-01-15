import { task } from "gulp";
import { DIST_ROOT } from "../constants";
import { cleanTask } from "../taskHelpers";

task('clean', cleanTask(DIST_ROOT));