/**
 * Configures Let's Encrypt if enabled.
 *
 * consumed by server/createApp.js
 *
 * @api private
 */

const letsencrypt = require('letsencrypt-express');

export default function (keystone, app) {

	const options = keystone.get('letsencrypt');
	const ssl = keystone.get('ssl');
	if (!options) {
		return;
	}
	if (!ssl) {
		console.error('Ignoring `letsencrypt` setting because `ssl` is not set.');
	}
	if (ssl === 'only') {
		console.error('To use Let\'s Encrypt you need to have a regular HTTP listener as well. Please set ssl to either `true` or `"force"`.');
	}

	const email = options.email;
	let approveDomains = options.domains;
	const server = options.production ? 'production' : 'staging';
	const agreeTos = options.tos;

	if (!Array.isArray(approveDomains)) {
		approveDomains = [approveDomains];
	}
	if (!(agreeTos && email && approveDomains)) {
		console.error("For auto registation with Let's Encrypt you have to agree to the TOS (https://letsencrypt.org/repository/) (tos: true), provide domains (domains: ['mydomain.com', 'www.mydomain.com']) and a domain owner email (email: 'admin@mydomain.com')");
		return;
	}
	// TODO maybe we should use le-store-mongo
	const lex = letsencrypt.create({
		server: server,
		approveDomains: approveDomains,
		agreeTos: agreeTos,
		email: email,
	});

	keystone.set('https server options', lex.httpsOptions);
	app.use(lex.middleware());
}
