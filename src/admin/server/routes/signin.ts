import * as ejs from 'ejs';
import * as path from 'path';

const templatePath = path.resolve(__dirname, '../templates/signin.html');

export function SigninRoute (req, res) {
	const keystone = req.keystone;
	const UserList = keystone.list(keystone.get('user model'));
	const locals = {
		adminPath: '/' + keystone.get('admin path'),
		brand: keystone.get('brand'),
		csrf: { header: {} },
		logo: keystone.get('signin logo'),
		redirect: keystone.get('signin redirect'),
		user: req.user ? {
			id: req.user.id,
			name: UserList.getDocumentName(req.user) || '(no name)',
		} : undefined,
		userCanAccessKeystone: !!(req.user && req.user.canAccessKeystone),
	};
	locals.csrf.header[keystone.security.csrf.CSRF_HEADER_KEY] = keystone.security.csrf.getToken(req, res);
	ejs.renderFile(templatePath, locals, { delimiter: '%' }, function (err, str) {
		if (err) {
			console.error('Could not render Admin UI Signin Template:', err);
			return res.status(500).send(keystone.wrapHTMLError('Error Rendering Signin', err.message));
		}
		res.send(str);
	});
}
