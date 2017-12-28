import * as compression from 'compression';
import * as favicon from 'serve-favicon';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';

import { language } from '../lib/middleware/language';

import { initLetsEncrypt } from './initLetsEncrypt';
import { initSslRedirect } from './initSslRedirect';
import { initTrustProxy } from './initTrustProxy';
import { initViewEngine } from './initViewEngine';
import { initViewLocals } from './initViewLocals';
import { bindIPRestrictions } from './bindIPRestrictions';
import { bindBodyParser } from './bindBodyParser';
import { bindLessMiddleware } from './bindLessMiddleware';
import { bindSassMiddleware } from './bindSassMiddleware';
import { bindStylusMiddleware } from './bindStylusMiddleware';
import { bindStaticMiddleware } from './bindStaticMiddleware';
import { bindSessionMiddleware } from './bindSessionMiddleware';
import { bindRedirectsHandler } from './bindRedirectsHandler';
import { bindErrorHandlers } from './bindErrorHandlers';
import { frameGuard } from '../lib/security/frameGuard';

export function createApp(keystone, express) {

    if (!keystone.app) {
        if (!express) {
            express = require('express');
        }
        keystone.app = express();
    }

    const app = keystone.app;
    initLetsEncrypt(keystone, app);
    initSslRedirect(keystone, app);

    keystone.initDatabaseConfig();
    keystone.initExpressSession(keystone.mongoose);

    initTrustProxy(keystone, app);
    initViewEngine(keystone, app);
    initViewLocals(keystone, app);
    bindIPRestrictions(keystone, app);

    // Compress response bodies
    if (keystone.get('compress')) {
        app.use(compression());
    }

    // Pre static config
    if (typeof keystone.get('pre:static') === 'function') {
        keystone.get('pre:static')(app);
    }
    app.use(function (req, res, next) {
        keystone.callHook('pre:static', req, res, next);
    });

    // Serve static assets

    if (keystone.get('favicon')) {
        app.use(favicon(keystone.getPath('favicon')));
    }

    // unless the headless option is set (which disables the Admin UI),
    // bind the Admin UI's Static Router for public resources
    if (!keystone.get('headless')) {
        app.use('/' + keystone.get('admin path'), require('../admin/server').createStaticRouter(keystone));
    }

    bindLessMiddleware(keystone, app);
    bindSassMiddleware(keystone, app);
    bindStylusMiddleware(keystone, app);
    bindStaticMiddleware(keystone, app);
    bindSessionMiddleware(keystone, app);

    // Log dynamic requests
    app.use(function (req, res, next) {
        keystone.callHook('pre:logger', req, res, next);
    });
    // Bind default logger (morgan)
    if (keystone.get('logger')) {
        const loggerOptions = keystone.get('logger options');
        const hasOwnProperty = Object.prototype.hasOwnProperty;
        if (loggerOptions && typeof loggerOptions.tokens === 'object') {
            for (const key in loggerOptions.tokens) {
                if (hasOwnProperty.call(loggerOptions.tokens, key) && typeof loggerOptions.tokens[key] === 'function') {
                    morgan.token(key, loggerOptions.tokens[key]);
                }
            }
        }

        app.use(morgan(keystone.get('logger'), loggerOptions));
    }
    // Bind custom logging middleware
    if (keystone.get('logging middleware')) {
        app.use(keystone.get('logging middleware'));
    }

    // unless the headless option is set (which disables the Admin UI),
    // bind the Admin UI's Dynamic Router
    if (!keystone.get('headless')) {
        if (typeof keystone.get('pre:admin') === 'function') {
            keystone.get('pre:admin')(app);
        }
        app.use(function (req, res, next) {
            keystone.callHook('pre:admin', req, res, next);
        });
        app.use('/' + keystone.get('admin path'), require('../admin/server').createDynamicRouter(keystone));
    }

    // Pre bodyparser middleware
    if (typeof keystone.get('pre:bodyparser') === 'function') {
        keystone.get('pre:bodyparser')(app);
    }
    app.use(function (req, res, next) {
        keystone.callHook('pre:bodyparser', req, res, next);
    });

    bindBodyParser(keystone, app);
    app.use(methodOverride());

    // Set language preferences
    const languageOptions = keystone.get('language options') || {};
    if (!languageOptions.disable) {
        app.use(language(keystone));
    }

    // Add 'X-Frame-Options' to response header for ClickJacking protection
    if (keystone.get('frame guard')) {
        app.use(frameGuard(keystone));
    }

    // Pre route config
    if (typeof keystone.get('pre:routes') === 'function') {
        keystone.get('pre:routes')(app);
    }
    app.use(function (req, res, next) {
        keystone.callHook('pre:routes', req, res, next);
    });

    // Configure application routes
    const appRouter = keystone.get('routes');
    if (typeof appRouter === 'function') {
        if (appRouter.length === 3) {
            // new:
            //    var myRouter = new express.Router();
            //    myRouter.get('/', (req, res) => res.send('hello world'));
            //    keystone.set('routes', myRouter);
            app.use(appRouter);
        } else {
            // old:
            //    var initRoutes = function (app) {
            //      app.get('/', (req, res) => res.send('hello world'));
            //    }
            //    keystone.set('routes', initRoutes);
            appRouter(app);
        }
    }


    bindRedirectsHandler(keystone, app);

    // Error config
    if (typeof keystone.get('pre:error') === 'function') {
        keystone.get('pre:error')(app);
    }
    app.use(function (req, res, next) {
        keystone.callHook('pre:error', req, res, next);
    });
    bindErrorHandlers(keystone, app);

    return app;

}
