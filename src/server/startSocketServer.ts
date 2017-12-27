/**
 * Configures and starts express server.
 *
 * Events are fired during initialisation to allow customisation, including:
 *   - onSocketServerCreated
 *
 * consumed by lib/core/start.js
 *
 * @api private
 */

const fs = require('fs');

export default function (keystone, app, callback) {

	const unixSocket = keystone.get('unix socket');
	const message = keystone.get('name') + ' is ready on ' + unixSocket;

	fs.unlink(unixSocket, function () {
		// we expect err if the file is new so don't capture the argument
		keystone.httpServer = app.listen(unixSocket, function (err) {
			callback(err, message);
		});
		fs.chmod(unixSocket, 0x777);
	});

}
