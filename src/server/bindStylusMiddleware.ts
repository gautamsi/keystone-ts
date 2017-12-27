export default function bindStylusMiddleware (keystone, app) {
	// the stylus option can be a single path, or array of paths
	// when set, we configure the stylus middleware
	let stylusPaths = keystone.get('stylus');
	const stylusOptions = keystone.get('stylus options') || {};
	const debug = require('debug')('keystone:core:bindStylusMiddleware');
	const _ = require('lodash');
	const safeRequire = require('../lib/safeRequire');

	if (typeof stylusPaths === 'string') {
		stylusPaths = [stylusPaths];
	}

	if (Array.isArray(stylusPaths)) {
		debug('adding stylus');
		const stylusMiddleware = safeRequire('stylus', 'stylus').middleware;

		stylusPaths.forEach(function (path) {
			app.use(stylusMiddleware(_.extend({
				src: keystone.expandPath(path),
				dest: keystone.expandPath(path),
				compress: keystone.get('env') === 'production',
			}, stylusOptions)));
		});
	}
}
