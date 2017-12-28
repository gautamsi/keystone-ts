export function logErrorMiddleware(req, res, next) {
	res.logError = function logError (endpoint, description, err) {
		if (arguments.length === 2 && typeof description !== 'string') {
			err = description;
			description = null;
		}
		let msg = '[' + endpoint + ']';
		msg += description ? ' ' + description + ':' : ' error:';
		if (err) {
			console.log(msg, err.message, '\n' + err.stack);
		} else {
			console.log(msg);
		}
	};
	next();
}
