import * as _ from 'lodash';
import * as express from 'express';
import * as grappling from 'grappling-hook';
import * as path from 'path';
import * as utils from 'keystone-utils';
const importer = require('./lib/core/importer');

import { List } from './lib/list';
import * as Session from './lib/session';
import { View } from './lib/view';

import { expandPath, get, getPath, options, set } from './lib/core/options';
import { retry } from 'async';
import { Mongoose } from 'mongoose';
import { Content } from './lib/content';
import { Storage } from './lib/storage';

/**
 * Don't use process.cwd() as it breaks module encapsulation
 * Instead, let's use module.parent if it's present, or the module itself if there is no parent (probably testing keystone directly if that's the case)
 * This way, the consuming app/module can be an embedded node_module and path resolutions will still work
 * (process.cwd() breaks module encapsulation if the consuming app/module is itself a node_module)
 */
let moduleRoot = (function (_rootPath) {
    let parts = _rootPath.split(path.sep);
    parts.pop(); // get rid of /node_modules from the end of the path
    return parts.join(path.sep);
})(module.parent ? module.parent.paths[0] : module.paths[0]);


/**
 * Keystone Class
 */
export class Keystone {


    lists: any = {};
    fieldTypes: any = {};
    _options: any = {};
    paths: any = {};
    _redirects: any = {};

    // expose express
    express: Express.Application = express;
    mongoose: Mongoose;
    middleware: any;
    callHook: Function;

    constructor() {
        grappling.mixin(this).allowHooks('pre:static', 'pre:bodyparser', 'pre:session', 'pre:logger', 'pre:admin', 'pre:routes', 'pre:render', 'updates', 'signin', 'signout');
        this._options = {
            'name': 'Keystone',
            'brand': 'Keystone',
            'admin path': 'keystone',
            'compress': true,
            'headless': false,
            'logger': ':method :url :status :response-time ms',
            'auto update': false,
            'model prefix': null,
            'module root': moduleRoot,
            'frame guard': 'sameorigin',
            'cache admin bundles': true,
        };

        // init environment defaults
        this.set('env', process.env.NODE_ENV || 'development');

        this.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || '3000');
        this.set('host', process.env.HOST || process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
        this.set('listen', process.env.LISTEN);

        this.set('ssl', process.env.SSL);
        this.set('ssl port', process.env.SSL_PORT || '3001');
        this.set('ssl host', process.env.SSL_HOST || process.env.SSL_IP);
        this.set('ssl key', process.env.SSL_KEY);
        this.set('ssl cert', process.env.SSL_CERT);

        this.set('cookie secret', process.env.COOKIE_SECRET);
        this.set('cookie signin', (this.get('env') === 'development') ? true : false);

        this.set('embedly api key', process.env.EMBEDLY_API_KEY || process.env.EMBEDLY_APIKEY);
        this.set('mandrill api key', process.env.MANDRILL_API_KEY || process.env.MANDRILL_APIKEY);
        this.set('mandrill username', process.env.MANDRILL_USERNAME);
        this.set('google api key', process.env.GOOGLE_BROWSER_KEY);
        this.set('google server api key', process.env.GOOGLE_SERVER_KEY);
        this.set('ga property', process.env.GA_PROPERTY);
        this.set('ga domain', process.env.GA_DOMAIN);
        this.set('chartbeat property', process.env.CHARTBEAT_PROPERTY);
        this.set('chartbeat domain', process.env.CHARTBEAT_DOMAIN);
        this.set('allowed ip ranges', process.env.ALLOWED_IP_RANGES);

        if (process.env.S3_BUCKET && process.env.S3_KEY && process.env.S3_SECRET) {
            this.set('s3 config', { bucket: process.env.S3_BUCKET, key: process.env.S3_KEY, secret: process.env.S3_SECRET, region: process.env.S3_REGION });
        }

        if (process.env.AZURE_STORAGE_ACCOUNT && process.env.AZURE_STORAGE_ACCESS_KEY) {
            this.set('azurefile config', { account: process.env.AZURE_STORAGE_ACCOUNT, key: process.env.AZURE_STORAGE_ACCESS_KEY });
        }

        if (process.env.CLOUDINARY_URL) {
            // process.env.CLOUDINARY_URL is processed by the cloudinary package when this is set
            this.set('cloudinary config', true);
        }

        // init mongoose
        this.set('mongoose', require('mongoose'));
        this.mongoose.Promise = require('es6-promise').Promise;

        // Attach middleware packages, bound to this instance
        this.middleware = {
            api: require('./lib/middleware/api')(this),
            cors: require('./lib/middleware/cors')(this),
        };

        Keystone.Field.Types = require('./lib/fieldTypes');
    }



    prefixModel(key) {
        let modelPrefix = this.get('model prefix');

        if (modelPrefix) {
            key = modelPrefix + '_' + key;
        }

        return require('mongoose/lib/utils').toCollectionName(key);
    }

    /* Attach core functionality to Keystone.prototype */
    createItems = require('./lib/core/createItems');
    createRouter = require('./lib/core/createRouter');
    getOrphanedLists = require('./lib/core/getOrphanedLists');
    importer = importer;
    init = require('./lib/core/init');
    initDatabaseConfig = require('./lib/core/initDatabaseConfig');
    initExpressApp = require('./lib/core/initExpressApp');
    initExpressSession = require('./lib/core/initExpressSession');
    initNav = require('./lib/core/initNav');
    list = require('./lib/core/list');
    openDatabaseConnection = require('./lib/core/openDatabaseConnection');
    closeDatabaseConnection = require('./lib/core/closeDatabaseConnection');
    populateRelated = require('./lib/core/populateRelated');
    redirect = require('./lib/core/redirect');
    start = require('./lib/core/start');
    wrapHTMLError = require('./lib/core/wrapHTMLError');
    createKeystoneHash = require('./lib/core/createKeystoneHash');

    /* Deprecation / Change warnings for 0.4 */
    routes() {
        throw new Error('keystone.routes(fn) has been removed, use keystone.set(\'routes\', fn)');
    }

    //#region options as prototype methods
    // _.extend(Keystone.prototype, require('./lib/core/options'));
    // expandPath, get, getPath, options, set
    expandPath(pathValue): string {
        return expandPath.apply(this, arguments);
    }

    get(key): any {
        return get.apply(this, arguments);
    }

    getPath(key, defaultValue): string {
        return getPath.apply(this, arguments);
    }

    options(key, value): any {
        return set.apply(this, arguments);
    }

    set(key, value): Keystone {
        return set.apply(this, arguments);
    }

    //#endregion


    /**
     * returns all .js modules (recursively) in the path specified, relative
     * to the module root (where the keystone project is being consumed from).
     *
     * ####Example:
     *     var models = keystone.import('models');
     */

    import(dirname) {
        return importer(this.get('module root'))(dirname);
    }


    /**
     * Applies Application updates
     */

    applyUpdates(callback) {
        this.callHook('pre:updates', (err) => {
            if (err) return callback(err);
            require('./lib/updates').apply((err) => {
                if (err) return callback(err);
                this.callHook('post:updates', callback);
            });
        });
    }


    /**
     * Logs a configuration error to the console
     */

    console = {
        err: (type, msg) => {
            if (this.get('logger')) {
                let dashes = '\n------------------------------------------------\n';
                console.log(dashes + 'KeystoneJS: ' + type + ':\n\n' + msg + dashes);
            }
        }
    };


    //#region static methods
    static instance = new Keystone();

    /*
	Note: until #1777 is complete, the order of execution here with the requires
	(specifically, they happen _after_ the module.exports above) is really
	important. As soon as the circular dependencies are sorted out to get their
	keystone instance from a closure or reference on {this} we can move these
	bindings into the Keystone constructor.
*/

    // Expose modules and Classes
    static Admin = {
        Server: require('./admin/server'),
    };
    static Email = require('./lib/email');
    static Field = require('./fields/types/Type');

    static Keystone = Keystone;
    static List = List.init(Keystone.instance);
    static Storage = Storage;
    static View = View;

    static content = Content.init(Keystone.instance);
    static security = {
        csrf: require('./lib/security/csrf'),
    };
    static utils = utils;

    /**
 * Keystone version
 */

    static version = require('../package.json').version;


    // Expose Modules
    static session = Session;

    //#endregion
}
