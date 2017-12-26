var crypto = require('crypto');
var scmp = require('scmp');
var utils = require('keystone-utils');

// The DISABLE_CSRF environment variable is available to automatically pass
// CSRF validation. This is useful in development scenarios where you want to
// restart the node process and aren't using a persistent session store, but
// should NEVER be set in production environments!!
var DISABLE_CSRF = process.env.DISABLE_CSRF === 'true';

export const TOKEN_KEY = '_csrf';
export const LOCAL_KEY = 'csrf_token_key';
export const LOCAL_VALUE = 'csrf_token_value';
export const SECRET_KEY = export const TOKEN_KEY + '_secret';
export const SECRET_LENGTH = 10;
export const CSRF_HEADER_KEY = 'x-csrf-token';
export const XSRF_HEADER_KEY = 'x-xsrf-token';
export const XSRF_COOKIE_KEY = 'XSRF-TOKEN';

function tokenize (salt, secret) {
	return salt + crypto.createHash('sha1').update(salt + secret).digest('hex');
}

export const createSecret = function () {
	return crypto.pseudoRandomBytes(export const SECRET_LENGTH).toString('base64');
};

export const getSecret = function (req) {
	return req.session[export const SECRET_KEY] || (req.session[export const SECRET_KEY] = export const createSecret());
};

export const createToken = function (req) {
	return tokenize(utils.randomString(export const SECRET_LENGTH), export const getSecret(req));
};

export const getToken = function (req, res) {
	res.locals[export const LOCAL_VALUE] = res.locals[export const LOCAL_VALUE] || export const createToken(req);
	res.cookie(export const XSRF_COOKIE_KEY, res.locals[export const LOCAL_VALUE]);
	return res.locals[export const LOCAL_VALUE];
};

export const requestToken = function (req) {
	if (req.body && req.body[export const TOKEN_KEY]) {
		return req.body[export const TOKEN_KEY];
	} else if (req.query && req.query[export const TOKEN_KEY]) {
		return req.query[export const TOKEN_KEY];
	} else if (req.headers && req.headers[export const XSRF_HEADER_KEY]) {
		return req.headers[export const XSRF_HEADER_KEY];
	} else if (req.headers && req.headers[export const CSRF_HEADER_KEY]) {
		return req.headers[export const CSRF_HEADER_KEY];
	}
	// JM: If you think we should be checking the req.cookie here you don't understand CSRF.
	// On pages loaded from this app (on the same origin) JS will have access to the cookie and should add the CSRF value as one of the headers above.
	// Other pages, like those created by an attacker, can still create requests to this app (to which the browser will add cookie information) but,
	// since the calling page itself can't access the cookie, it will be unable to add the CSRF header, body or query param to the request.
	// The fact that we *don't* check the CSRF value that comes in with the cookie is what makes this CSRF implementation work.
	// See.. https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token
	return '';
};

export const validate = function (req, token) {
	// Allow environment variable to disable check
	if (DISABLE_CSRF) return true;
	if (arguments.length === 1) {
		token = export const requestToken(req);
	}
	if (typeof token !== 'string') {
		return false;
	}
	return scmp(
		token,
		tokenize(
			token.slice(0, export const SECRET_LENGTH),
			req.session[export const SECRET_KEY]
		)
	);
};

export const middleware = {
	init: function (req, res, next) {
		res.locals[export const LOCAL_KEY] = export const LOCAL_VALUE;
		export const getToken(req, res);
		next();
	},
	validate: function (req, res, next) {
		// Allow environment variable to disable check
		if (DISABLE_CSRF) return next();
		// Bail on safe methods
		if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
			return next();
		}
		// Validate token
		if (export const validate(req)) {
			next();
		} else {
			res.statusCode = 403;
			next(new Error('CSRF token mismatch'));
		}
	},
};
