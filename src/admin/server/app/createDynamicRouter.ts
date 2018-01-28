import { Keystone } from '../../../keystone';
import { persist, keystoneAuth } from '../../../lib/session';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as multer from 'multer';

import { createHealthchecksHandler } from './createHealthchecksHandler';

import { IndexRoute } from '../routes/index';
import { SigninRoute } from '../routes/signin';
import { SignoutRoute } from '../routes/signout';

import { apiErrorMiddleware } from '../middleware/apiError';
import { logErrorMiddleware } from '../middleware/logError';
import { initListMiddleware } from '../middleware/initList';

import { sessionHandler } from '../api/session';
import { listHandler } from '../api/list';
import { itemHandler } from '../api/item';
import { cloudinaryHandler } from '../api/cloudinary';
import { s3Handler } from '../api/s3';
import { countsHandler } from '../api/counts';

export function createDynamicRouter(keystone: Keystone): any {
    // ensure keystone nav has been initialised
    // TODO: move this elsewhere (on demand generation, or client-side?)
    if (!keystone.nav) {
        keystone.nav = keystone.initNav();
    }

    const router = express.Router();


    // Use bodyParser and multer to parse request bodies and file uploads
    router.use(bodyParser.json({}));
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(multer({ includeEmptyFields: true }));

    // Bind the request to the keystone instance
    router.use(function (req, res, next) {
        req['keystone'] = keystone;
        next();
    });

    if (keystone.get('healthchecks')) {
        router.use('/server-health', createHealthchecksHandler(keystone));
    }

    // Init API request helpers
    router.use('/api', apiErrorMiddleware);
    router.use('/api', logErrorMiddleware);

    // #1: Session API
    // TODO: this should respect keystone auth options
    router.get('/api/session', sessionHandler.get);
    router.post('/api/session/signin', sessionHandler.signin);
    router.post('/api/session/signout', sessionHandler.signout);

    // #2: Session Routes
    // Bind auth middleware (generic or custom) to * routes, allowing
    // access to the generic signin page if generic auth is used
    if (keystone.get('auth') === true) {
        // TODO: poor separation of concerns; settings should be defaulted elsewhere
        if (!keystone.get('signout url')) {
            keystone.set('signout url', '/' + keystone.get('admin path') + '/signout');
        }
        if (!keystone.get('signin url')) {
            keystone.set('signin url', '/' + keystone.get('admin path') + '/signin');
        }
        if (!keystone.nativeApp || !keystone.get('session')) {
            router.all('*', persist);
        }
        router.all('/signin', SigninRoute);
        router.all('/signout', SignoutRoute);
        router.use(keystoneAuth);
    } else if (typeof keystone.get('auth') === 'function') {
        router.use(keystone.get('auth'));
    }

    // #3: Home route
    router.get('/', IndexRoute);

    // #4: Cloudinary and S3 specific APIs
    // TODO: poor separation of concerns; should / could this happen elsewhere?
    if (keystone.get('cloudinary config')) {
        router.get('/api/cloudinary/get', cloudinaryHandler.get);
        router.get('/api/cloudinary/autocomplete', cloudinaryHandler.autocomplete);
        router.post('/api/cloudinary/upload', cloudinaryHandler.upload);
    }
    if (keystone.get('s3 config')) {
        router.post('/api/s3/upload', s3Handler.upload);
    }

    // #5: Core Lists API

    // lists
    router.all('/api/counts', countsHandler);
    router.get('/api/:list', initListMiddleware, listHandler.get);
    router.get('/api/:list/:format(export.csv|export.json)', initListMiddleware, listHandler.download);
    router.post('/api/:list/create', initListMiddleware, listHandler.create);
    router.post('/api/:list/update', initListMiddleware, listHandler.update);
    router.post('/api/:list/delete', initListMiddleware, listHandler.delete);
    // items
    router.get('/api/:list/:id', initListMiddleware, itemHandler.get);
    router.post('/api/:list/:id', initListMiddleware, itemHandler.update);
    router.post('/api/:list/:id/delete', initListMiddleware, listHandler.delete);
    router.post('/api/:list/:id/sortOrder/:sortOrder/:newOrder', initListMiddleware, itemHandler.sortOrder);

    // #6: List Routes
    router.all('/:list/:page([0-9]{1,5})?', IndexRoute);
    router.all('/:list/:item', IndexRoute);

    // TODO: catch 404s and errors with Admin-UI specific handlers

    return router;
}
