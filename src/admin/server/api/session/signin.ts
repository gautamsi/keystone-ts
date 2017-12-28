import * as  utils from 'keystone-utils';
import { signinWithUser } from '../../../../lib/session';

export function signin(req, res) {
    const keystone = req.keystone;
    if (!keystone.security.csrf.validate(req)) {
        return res.apiError(403, 'invalid csrf');
    }
    if (!req.body.email || !req.body.password) {
        return res.status(401).json({ error: 'email and password required' });
    }
    const User = keystone.list(keystone.get('user model'));
    const emailRegExp = new RegExp('^' + utils.escapeRegExp(req.body.email) + '$', 'i');
    User.model.findOne({ email: emailRegExp }).exec(function (err, user) {
        if (user) {
            keystone.callHook(user, 'pre:signin', req, function (err) {
                if (err) return res.status(500).json({ error: 'pre:signin error', detail: err });
                user._.password.compare(req.body.password, function (err, isMatch) {
                    if (isMatch) {
                        signinWithUser(user, req, res, function () {
                            keystone.callHook(user, 'post:signin', req, function (err) {
                                if (err) return res.status(500).json({ error: 'post:signin error', detail: err });
                                res.json({ success: true, user: user });
                            });
                        });
                    } else if (err) {
                        return res.status(500).json({ error: 'bcrypt error', detail: err });
                    } else {
                        return res.status(401).json({ error: 'invalid details' });
                    }
                });
            });
        } else if (err) {
            return res.status(500).json({ error: 'database error', detail: err });
        } else {
            return res.status(401).json({ error: 'invalid details' });
        }
    });
}
