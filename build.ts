import * as browserify from 'browserify';

import { packages } from './src/admin/client/packages';
var b = browserify({
	debug: process.env.NODE_ENV !== 'production',
});
packages.forEach(function (i) { b.require(i); });
b.bundle().pipe(process.stdout);
