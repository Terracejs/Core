import { join } from 'path';

export const TERRACE_VERSION = require("../../package.json").version;
export const TERRACE_LICENSE = require("../../package.json").license;

export const PROJECT_ROOT = join(__dirname, '../../');
export const SOURCE_ROOT = join(PROJECT_ROOT, 'src');

export const DIST_ROOT = join(PROJECT_ROOT, 'dist');

export const LICENSE_BANNER = `/**
	* @license Terracejs v${TERRACE_VERSION}
	*	Copyright (c) 2017 Reese Bingham
	* License: ${TERRACE_LICENSE}
	*/`