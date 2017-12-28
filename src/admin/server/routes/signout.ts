import { signout } from '../../../lib/session';

export function SignoutRoute(req, res) {
    const keystone = req.keystone;
    signout(req, res, function () {
        // After logging out, the user will be redirected to /signin?signedout
        // It shows a bar on top of the sign in panel saying "You have been signed out".
        if (typeof keystone.get('signout redirect') === 'string') {
            return res.redirect(keystone.get('signout redirect'));
        } else if (typeof keystone.get('signout redirect') === 'function') {
            return keystone.get('signout redirect')(req, res);
        } else {
            return res.redirect('/' + keystone.get('admin path') + '/signin?signedout');
        }
    });
}
