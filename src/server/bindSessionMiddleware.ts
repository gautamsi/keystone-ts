import * as connectFlash from 'connect-flash';
import { Keystone } from '../keystone';
import { Application } from 'express';

export function bindSessionMiddleware(keystone: Keystone, app: Application) {

    app.use(keystone.get('session options').cookieParser);

    // pre:session hooks
    if (typeof keystone.get('pre:session') === 'function') {
        keystone.get('pre:session')(app);
    }
    app.use(function (req, res, next) {
        keystone.callHook('pre:session', req, res, next);
    });

    app.use(keystone.expressSession);
    app.use(connectFlash());

    if (keystone.get('session') === true) {
        app.use(keystone.session.persist);
    } else if (typeof keystone.get('session') === 'function') {
        app.use(keystone.get('session'));
    }
}
