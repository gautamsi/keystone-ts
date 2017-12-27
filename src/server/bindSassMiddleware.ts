export default function bindSassMiddleware (keystone, app) {
	// the sass option can be a single path, or array of paths
	// when set, we configure the node-sass middleware

	let sassPaths = keystone.get('sass');
	const sassOptions = keystone.get('sass options') || {};
	const debug = require('debug')('keystone:core:bindSassMiddleware');
	const _ = require('lodash');
	const safeRequire = require('../lib/safeRequire');

	if (typeof sassPaths === 'string') {
		sassPaths = [sassPaths];
	}

	if (Array.isArray(sassPaths)) {
		debug('adding sass');
		const sassMiddleware = safeRequire('node-sass-middleware', 'sass');

		const outputStyle = keystone.get('env') === 'production' ? 'compressed' : 'nested';
		sassPaths.forEach(function (path) {
			app.use(sassMiddleware(_.extend({
				src: keystone.expandPath(path),
				dest: keystone.expandPath(path),
				outputStyle: outputStyle,
			}, sassOptions)));
		});
	}
}
