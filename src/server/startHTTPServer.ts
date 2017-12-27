/**
 * Configures and starts express server.
 *
 * Events are fired during initialisation to allow customisation, including:
 *   - onHttpServerCreated
 *
 * consumed by lib/core/start.js
 *
 * @api private
 */

const http = require('http');

export default function (keystone, app, callback) {

	const host = keystone.get('host');
	const port = keystone.get('port');
	const forceSsl = (keystone.get('ssl') === 'force');

	keystone.httpServer = http
	.createServer(app)
	.listen(port, host, function ready (err) {
		if (err) { return callback(err); }

		const message = keystone.get('name') + ' is ready on '
		+ 'http://' + host + ':' + port
		+ (forceSsl ? ' (SSL redirect)' : '');
		callback(null, message);
	});

}
