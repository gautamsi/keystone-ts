import { startSocketServer } from './server/startSocketServer';
import { startSecureServer } from './server/startSecureServer';
import { startHTTPServer } from './server/startHTTPServer';
import * as _ from 'lodash';
import * as express from 'express';
import * as grappling from 'grappling-hook';
import * as path from 'path';
import * as utils from 'keystone-utils';

import { List } from './lib/list';
import * as Session from './lib/session';
import { View } from './lib/view';

import { retry } from 'async';
import * as mongoose from 'mongoose';
import { Content } from './lib/content';
import { Storage } from './lib/storage';
import { Email } from './lib/email';
import * as csrf from './lib/security/csrf';
import { applyUpdates } from './lib/updates';
import { api } from './lib/middleware/api';
import { cors } from './lib/middleware/cors';
import * as _debug from 'debug';
import * as async from 'async';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as  session from 'express-session';
import * as  cookieParser from 'cookie-parser';
// import { Promise } from 'es6-promise';
import { safeRequire } from './lib/safeRequire';
import * as callerId from 'caller-id';
import * as url from 'url';
import { FieldTypeBase } from './fields/types/FieldTypeBase';
import { FieldTypes } from './fields/types';
import { FieldBase } from './fields/types/FieldBase';
import { createApp } from './server/createApp';



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
    Field: { Types: typeof FieldTypes };
    List: typeof List;
    utils = utils;
    session: any;
    content: any;
    View: typeof View;


    sessionStorePromise: any;
    expressSession: express.RequestHandler;
    app: any;
    nav: any;


    lists: any = {};
    fieldTypes: any = {};
    _options: any = {};
    paths: any = {};
    _redirects: any = {};

    // expose express
    express: Express.Application = express;
    mongoose: mongoose.Mongoose;
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
        this.set('mongoose', mongoose);
        this.mongoose.Promise = Promise; // require('es6-promise').Promise;

        // Attach middleware packages, bound to this instance
        this.middleware = {
            api: api(this),
            cors: cors(this),
        };

    }

    // Keystone.Field.Types = require('./lib/fieldTypes');


    prefixModel(key) {
        let modelPrefix = this.get('model prefix');

        if (modelPrefix) {
            key = modelPrefix + '_' + key;
        }

        return require('mongoose/lib/utils').toCollectionName(key);
    }


    /* Attach core functionality to Keystone.prototype */
    closeDatabaseConnection(callback) {
        const debug = _debug('keystone:core:closeDatabaseConnection');
        this.mongoose.disconnect(function () {
            debug('mongo connection closed');
            callback && callback();
        });
        return this;
    }

    createItems(data, ops, callback) {
        const debug = _debug('keystone:core:createItems');

        const keystone = this;

        const options = {
            verbose: false,
            strict: true,
            refs: null,
        };

        const dashes = '------------------------------------------------';

        if (!_.isObject(data)) {
            throw new Error('keystone.createItems() requires a data object as the first argument.');
        }

        if (_.isObject(ops)) {
            _.extend(options, ops);
        }

        if (typeof ops === 'function') {
            callback = ops;
        }

        const lists = _.keys(data);
        const refs = options.refs || {};
        const stats: any = {};

        // logger function
        function writeLog(data) {
            console.log(keystone.get('name') + ': ' + data);
        }

        async.waterfall([

            // create items
            function (next) {
                async.eachSeries(lists, function (key, doneList) {

                    const list = keystone.list(key);
                    const relationshipPaths = _.filter(list.fields, { type: 'relationship' }).map(function (i) { return i.path; });

                    if (!list) {
                        if (options.strict) {
                            return doneList({
                                type: 'invalid list',
                                message: 'List key ' + key + ' is invalid.',
                            });
                        }
                        if (options.verbose) {
                            writeLog('Skipping invalid list: ' + key);
                        }
                        return doneList();
                    }

                    if (!refs[list.key]) {
                        refs[list.key] = {};
                    }

                    stats[list.key] = {
                        singular: list.singular,
                        plural: list.plural,
                        created: 0,
                        warnings: 0,
                    };

                    let itemsProcessed = 0;
                    const totalItems = data[key].length;

                    if (options.verbose) {
                        writeLog(dashes);
                        writeLog('Processing list: ' + key);
                        writeLog('Items to create: ' + totalItems);
                        writeLog(dashes);
                    }

                    async.eachSeries(data[key], function (data: any, doneItem) {

                        itemsProcessed++;

                        // Evaluate function properties to allow generated values (excluding relationships)
                        _.keys(data).forEach(function (i) {
                            if (typeof data[i] === 'function' && relationshipPaths.indexOf(i) === -1) {
                                data[i] = data[i]();
                                if (options.verbose) {
                                    writeLog('Generated dynamic value for [' + i + ']: ' + data[i]);
                                }
                            }
                        });

                        const doc = data.__doc = new list.model();

                        if (data.__ref) {
                            refs[list.key][data.__ref] = doc;
                        }

                        async.each(list.fieldsArray, function (field: any, doneField) {
                            // skip relationship fields on the first pass.
                            if (field.type !== 'Relationship') {
                                // TODO: Validate items?
                                field.updateItem(doc, data, doneField);
                            } else {
                                doneField();
                            }
                        }, function (err) {
                            if (!err) {
                                if (options.verbose) {
                                    const documentName = list.getDocumentName(doc);
                                    writeLog('Creating item [' + itemsProcessed + ' of ' + totalItems + '] - ' + documentName);
                                }

                                doc.save(function (err) {
                                    if (err) {
                                        err.model = key;
                                        err.data = data;
                                        debug('error saving ', key);
                                    } else {
                                        stats[list.key].created++;
                                    }
                                    doneItem(err);
                                });
                            } else {
                                doneItem(err);
                            }
                        });
                    }, doneList);

                }, next);
            },

            // link items
            function (next) {

                async.each(lists, function (key, doneList) {

                    const list = keystone.list(key);
                    const relationships = _.filter(list.fields, { type: 'relationship' });

                    if (!list || !relationships.length) {
                        return doneList();
                    }

                    let itemsProcessed = 0;
                    const totalItems = data[key].length;

                    if (options.verbose) {
                        writeLog(dashes);
                        writeLog('Processing relationships for: ' + key);
                        writeLog('Items to process: ' + totalItems);
                        writeLog(dashes);
                    }

                    async.each(data[key], function (srcData: any, doneItem) {

                        const doc = srcData.__doc;
                        let relationshipsUpdated = 0;

                        itemsProcessed++;

                        if (options.verbose) {
                            const documentName = list.getDocumentName(doc);
                            writeLog('Processing item [' + itemsProcessed + ' of ' + totalItems + '] - ' + documentName);
                        }

                        async.each(relationships, function (field, doneField) {

                            let fieldValue = null;
                            let refsLookup = null;

                            if (!field.path) {
                                writeLog('WARNING:  Invalid relationship (undefined list path) [List: ' + key + ']');
                                stats[list.key].warnings++;
                                return doneField();
                            } else {
                                fieldValue = srcData[field.path];
                            }

                            if (!field.refList) {
                                if (fieldValue) {
                                    writeLog('WARNING:  Invalid relationship (undefined reference list) [list: ' + key + '] [path: ' + fieldValue + ']');
                                    stats[list.key].warnings++;
                                }
                                return doneField();
                            }

                            if (!field.refList.key) {
                                writeLog('WARNING:  Invalid relationship (undefined ref list key) [list: ' + key + '] [field.refList: ' + field.refList + '] [fieldValue: ' + fieldValue + ']');
                                stats[list.key].warnings++;
                                return doneField();
                            } else {
                                refsLookup = refs[field.refList.key];
                            }

                            if (!fieldValue) {
                                return doneField();
                            }

                            // populate relationships from saved refs
                            if (typeof fieldValue === 'function') {

                                relationshipsUpdated++;

                                const fn = fieldValue;
                                const argsRegExp = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
                                const lists = fn.toString().match(argsRegExp)[1].split(',').map(function (i) { return i.trim(); });
                                const args = lists.map(function (i) {
                                    return keystone.list(i);
                                });
                                const query = fn.apply(keystone, args);

                                query.exec(function (err, results) {
                                    if (err) { debug('error ', err); }
                                    if (field.many) {
                                        doc.set(field.path, results || []);
                                    } else {
                                        doc.set(field.path, (results && results.length) ? results[0] : undefined);
                                    }
                                    doneField(err);
                                });

                            } else if (_.isArray(fieldValue)) {

                                if (field.many) {

                                    const refsArr = _.compact(fieldValue.map(function (ref) {
                                        return isMongoId(ref) ? ref : refsLookup && refsLookup[ref] && refsLookup[ref].id;
                                    }));

                                    if (options.strict && refsArr.length !== fieldValue.length) {
                                        return doneField({
                                            type: 'invalid ref',
                                            srcData: srcData,
                                            message: 'Relationship ' + list.key + '.' + field.path + ' contains an invalid reference.',
                                        });
                                    }

                                    relationshipsUpdated++;
                                    doc.set(field.path, refsArr);
                                    doneField();

                                } else {
                                    return doneField({
                                        type: 'invalid data',
                                        srcData: srcData,
                                        message: 'Single-value relationship ' + list.key + '.' + field.path + ' provided as an array.',
                                    });
                                }

                            } else if (typeof fieldValue === 'string') {

                                const refItem = isMongoId(fieldValue) ? fieldValue : refsLookup && refsLookup[fieldValue] && refsLookup[fieldValue].id;

                                if (!refItem) {
                                    return options.strict ? doneField({
                                        type: 'invalid ref',
                                        srcData: srcData,
                                        message: 'Relationship ' + list.key + '.' + field.path + ' contains an invalid reference: "' + fieldValue + '".',
                                    }) : doneField();
                                }

                                relationshipsUpdated++;

                                doc.set(field.path, field.many ? [refItem] : refItem);

                                doneField();

                            } else if (fieldValue && fieldValue.id) {

                                relationshipsUpdated++;
                                doc.set(field.path, field.many ? [fieldValue.id] : fieldValue.id);
                                doneField();

                            } else {
                                return doneField({
                                    type: 'invalid data',
                                    srcData: srcData,
                                    message: 'Relationship ' + list.key + '.' + field.path + ' contains an invalid data type.',
                                });
                            }

                        }, function (err) {
                            if (err) {
                                debug('error ', err);
                                return doneItem(err);
                            }
                            if (options.verbose) {
                                writeLog('Populated ' + utils.plural(relationshipsUpdated, '* relationship', '* relationships') + '.');
                            }
                            if (relationshipsUpdated) {
                                doc.save(doneItem);
                            } else {
                                doneItem();
                            }
                        });

                    }, doneList);

                }, next);
            },

        ], function (err: any) {

            if (err) {
                console.error(err);
                if ('stack' in err) {
                    console.trace(err.stack);
                }
                return callback && callback(err);
            }

            let msg = '\nSuccessfully created:\n';
            _.forEach(stats, function (list) {
                msg += '\n*   ' + utils.plural(list.created, '* ' + list.singular, '* ' + list.plural);
                if (list.warnings) {
                    msg += '\n    ' + utils.plural(list.warnings, '* warning', '* warnings');
                }
            });
            stats.message = msg + '\n';

            callback(null, stats);
        });
    }

    createKeystoneHash() {
        const hash = crypto.createHash('md5');
        hash.update(Keystone.version);

        _.forEach(this.lists, function (list, key) {
            hash.update(JSON.stringify(list.getOptions()));
        });

        return hash.digest('hex').slice(0, 6);
    }

    /*
        This is a shorthand method for keystone instances to create a new express
        router, to make it simpler for projects that don't directly depend on express
    */
    createRouter(): any {
        return express.Router();
    }

    /**
     * Retrieves orphaned lists (those not in a nav section)
     */

    getOrphanedLists() {
        if (!this.nav) {
            return [];
        }
        return _.filter(this.lists, function (list, key) {
            if (list.get('hidden')) return false;
            return (!this.nav.by.list[key]) ? list : false;
        }.bind(this));
    }

    /**
     * Returns a function that looks in a specified path relative to the current
     * directory, and returns all .js modules in it (recursively).
     *
     * ####Example:
     *
     *     var importRoutes = keystone.importer(__dirname);
     *
     *     var routes = {
     *         site: importRoutes('./site'),
     *         api: importRoutes('./api')
     *     };
     *
     * @param {String} rel__dirname
     * @api public
     */

    importer(rel__dirname) {
        const debug = _debug('keystone:core:importer');

        function importer(from) {
            debug('importing ', from);
            const imported = {};
            const joinPath = function (...params) {
                return '.' + path.sep + path.join.apply(path, arguments);
            };

            const fsPath = joinPath(path.relative(process.cwd(), rel__dirname), from);
            fs.readdirSync(fsPath).forEach(function (name) {
                const info = fs.statSync(path.join(fsPath, name));
                debug('recur');
                if (info.isDirectory()) {
                    imported[name] = importer(joinPath(from, name));
                } else {
                    // only import files that we can `require`
                    const ext = path.extname(name);
                    const base = path.basename(name, ext);
                    if (require.extensions[ext]) {
                        imported[base] = require(path.join(rel__dirname, from, name));
                    } else {
                        debug('cannot require ', ext);
                    }
                }
            });

            return imported;
        }

        return importer;
    }

    /**
     * Initialises Keystone with the provided options
     */

    init(options) {
        this.options(options);
        return this;
    }

    initDatabaseConfig() {
        if (!this.get('mongo')) {
            const dbName = this.get('db name')
                || utils.slug(this.get('name'));
            const dbUrl = process.env.MONGO_URI
                || process.env.MONGODB_URI
                || process.env.MONGO_URL
                || process.env.MONGODB_URL
                || process.env.MONGOLAB_URI
                || process.env.MONGOLAB_URL
                || (process.env.OPENSHIFT_MONGODB_DB_URL
                    || 'mongodb://localhost/') + dbName;
            this.set('mongo', dbUrl);
        }
        return this;
    }

    initExpressApp(customApp?) {
        if (this.app) return this;
        this.initDatabaseConfig();
        this.initExpressSession(this.mongoose);
        if (customApp) {
            this.app = customApp;
            createApp(this);
        } else {
            this.app = createApp(this);
        }
        return this;
    }

    initExpressSession(mongoose) {
        const debug = _debug('keystone:core:initExpressSession');

        if (this.expressSession) return this;

        let sessionStorePromise;

        // Initialise and validate session options
        if (!this.get('cookie secret')) {
            console.error('\nKeystoneJS Configuration Error:\n\nPlease provide a `cookie secret` value for session encryption.\n');
            process.exit(1);
        }
        let sessionOptions = this.get('session options');

        if (typeof sessionOptions !== 'object') {
            sessionOptions = {};
        }
        if (!sessionOptions.key) {
            sessionOptions.key = 'this.sid';
        }
        if (!sessionOptions.resave) {
            sessionOptions.resave = false;
        }
        if (!sessionOptions.saveUninitialized) {
            sessionOptions.saveUninitialized = false;
        }
        if (!sessionOptions.secret) {
            sessionOptions.secret = this.get('cookie secret');
        }

        sessionOptions.cookieParser = cookieParser(this.get('cookie secret'));

        let sessionStore = this.get('session store');

        if (typeof sessionStore === 'function') {
            sessionOptions.store = sessionStore(session);
        } else if (sessionStore) {

            const sessionStoreOptions = this.get('session store options') || {};

            // Perform any session store specific configuration or exit on an unsupported session store

            if (sessionStore === 'mongo') {
                sessionStore = 'connect-mongo';
            } else if (sessionStore === 'redis') {
                sessionStore = 'connect-redis';
            }

            switch (sessionStore) {
                case 'connect-mongo':
                    debug('using connect-mongo session store');
                    if (process.version.substr(0, 4) === 'v0.1') {
                        // try to require connect-mongo/es5; if this works, we can
                        // assume a new version of connect-mongo, and the es5
                        // variant should be used
                        try {
                            require('connect-mongo/es5');
                            sessionStore = 'connect-mongo/es5';
                        } catch (e) {
                            // if it throws, allow the error to be handled by the
                            // normal try/catch process around initialisation
                        }
                    }
                    _.defaults(sessionStoreOptions, {
                        collection: 'app_sessions',
                        mongooseConnection: mongoose.connection,
                    });
                    break;

                case 'connect-mongostore':
                    debug('using connect-mongostore session store');
                    _.defaults(sessionStoreOptions, {
                        collection: 'app_sessions',
                    });
                    if (!sessionStoreOptions.db) {
                        console.error(
                            '\nERROR: connect-mongostore requires `session store options` to be set.'
                            + '\n'
                            + '\nSee http://thisjs.com/docs/configuration#options-database for details.'
                            + '\n');
                        process.exit(1);
                    }
                    break;

                case 'connect-redis':
                    debug('using connect-redis session store');
                    break;

                default:
                    console.error(
                        '\nERROR: unsupported session store ' + sessionStore + '.'
                        + '\n'
                        + '\nSee http://thisjs.com/docs/configuration#options-database for details.'
                        + '\n');
                    process.exit(1);
                    break;
            }

            // Initialize the session store
            const SessionStore = safeRequire(sessionStore, this.get('session store') + ' as a `session store` option')(session);

            sessionStorePromise = new Promise(
                function (resolve, reject) {
                    sessionOptions.store = new SessionStore(sessionStoreOptions, resolve);
                    sessionOptions.store.on('connect', resolve);
                    sessionOptions.store.on('connected', resolve);
                    sessionOptions.store.on('disconnect', function () {
                        console.error(
                            '\nThere was an error connecting to the ' + sessionStore + ' session store.'
                            + '\n');
                        process.exit(1);
                    });
                }
            );
        }

        // expose initialised session and options
        this.set('session options', sessionOptions);
        this.expressSession = session(sessionOptions);
        this.sessionStorePromise = sessionStorePromise;

        return this;
    }

    initNav(sections?) {
        const keystone = this;

        const nav: any = {
            sections: [],
            by: {
                list: {},
                section: {},
            },
        };

        if (!sections) {
            sections = {};
            nav.flat = true;
            _.forEach(this.lists, function (list) {
                if (list.get('hidden')) return;
                sections[list.path] = [list.path];
            });
        }

        _.forEach(sections, function (section, key) {
            if (typeof section === 'string') {
                section = [section];
            }
            section = {
                lists: section,
                label: nav.flat ? keystone.list(section[0]).label : utils.keyToLabel(key),
            };
            section.key = key;
            section.lists = _.map(section.lists, function (i: any) {
                if (typeof i === 'string') {
                    const list = keystone.list(i);
                    if (!list) {
                        throw new Error('Invalid Keystone Option (nav): list ' + i + ' has not been defined.\n');
                    }
                    if (list.get('hidden')) {
                        throw new Error('Invalid Keystone Option (nav): list ' + i + ' is hidden.\n');
                    }
                    nav.by.list[list.key] = section;
                    return {
                        key: list.key,
                        label: list.label,
                        path: list.path,
                    };
                } else if (_.isObject(i)) {
                    if (!_.has(i, 'key')) {
                        throw new Error('Invalid Keystone Option (nav): object ' + i + ' requires a "key" property.\n');
                    }
                    i.label = i.label || utils.keyToLabel(key);
                    i.path = i.path || utils.keyToPath(key);
                    i.external = true;
                    nav.by.list[i.key] = section;
                    return i;
                }
                throw new Error('Invalid Keystone Option (nav): ' + i + ' is in an unrecognized format.\n');
            });
            if (section.lists.length) {
                nav.sections.push(section);
                nav.by.section[section.key] = section;
            }
        });

        return nav;
    }

    /**
     * Retrieves a list
     */

    list(key) {
        const result = this.lists[key] || this.lists[this.paths[key]];
        if (!result) throw new ReferenceError('Unknown keystone list ' + JSON.stringify(key));
        return result;
    }

    openDatabaseConnection(callback) {
        const debug = _debug('keystone:core:openDatabaseConnection');

        const keystone = this;
        let mongoConnectionOpen = false;

        // support replica sets for mongoose
        if (keystone.get('mongo replica set')) {

            if (keystone.get('logger')) {
                console.log('\nWarning: using the `mongo replica set` option has been deprecated and will be removed in'
                    + ' a future version.\nInstead set the `mongo` connection string with your host details, e.g.'
                    + ' mongodb://username:password@host:port,host:port,host:port/database and set any replica set options'
                    + ' in `mongo options`.\n\nRefer to https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html'
                    + ' for more details on the connection settings.');
            }

            debug('setting up mongo replica set');
            const replicaData = keystone.get('mongo replica set');
            let replica = '';

            const credentials = (replicaData.username && replicaData.password) ? replicaData.username + ':' + replicaData.password + '@' : '';

            replicaData.db.servers.forEach(function (server) {
                replica += 'mongodb://' + credentials + server.host + ':' + server.port + '/' + replicaData.db.name + ',';
            });

            const options = {
                auth: { authSource: replicaData.authSource },
                replset: {
                    rs_name: replicaData.db.replicaSetOptions.rs_name,
                    readPreference: replicaData.db.replicaSetOptions.readPreference,
                },
            };

            debug('connecting to replica set');
            keystone.mongoose.connect(replica, options);

        } else {
            debug('connecting to mongo');
            keystone.initDatabaseConfig();
            keystone.mongoose.connect(keystone.get('mongo'), keystone.get('mongo options'));
        }

        keystone.mongoose.connection.on('error', function (err) {

            // The DB connection has been established previously and this a ValidationError caused by restrictions Mongoose is enforcing on the field value
            // We can ignore these here; they'll also be picked up by the 'error' event listener on the model; see /lib/list/register.js
            if (mongoConnectionOpen && err && err.name === 'ValidationError') return;

            // Alternatively, the error is legitimate; output it
            console.error('------------------------------------------------');
            console.error('Mongoose connection "error" event fired with:');
            console.error(err);

            // There's been an error establishing the initial connection, ie. Keystone is attempting to start
            if (!mongoConnectionOpen) {
                throw new Error('KeystoneJS (' + keystone.get('name') + ') failed to start - Check that you are running `mongod` in a separate process.');
            }

            // Otherwise rethrow the initial error
            throw err;

        }).once('open', function () {

            debug('mongo connection open');
            mongoConnectionOpen = true;

            const connected = function () {
                if (keystone.get('auto update')) {
                    debug('applying auto update');
                    keystone.applyUpdates(callback);
                } else {
                    callback();
                }
            };

            if (keystone.sessionStorePromise) {
                keystone.sessionStorePromise.then(connected);
            } else {
                connected();
            }

        });

        return this;
    }

    /**
     * Populates relationships on a document or array of documents
     *
     * WARNING: This is currently highly inefficient and should only be used in development, or for
     * small data sets. There are lots of things that can be done to improve performance... later.
     *
     * @api public
     */

    populateRelated(docs, relationships, callback) {
        if (Array.isArray(docs)) {
            async.each(docs, function (doc, done) {
                doc.populateRelated(relationships, done);
            }, callback);
        } else if (docs && docs.populateRelated) {
            docs.populateRelated(relationships, callback);
        } else {
            callback();
        }
        return this;
    }

    /**
     * Adds one or more redirections (urls that are redirected when no matching
     * routes are found, before treating the request as a 404)
     *
     * #### Example:
     * 		keystone.redirect('/old-route', 'new-route');
     *
     * 		// or
     *
     * 		keystone.redirect({
     * 			'old-route': 'new-route'
     * 		});
     */

    redirect() {
        if (arguments.length === 1 && utils.isObject(arguments[0])) {
            _.extend(this._redirects, arguments[0]);
        } else if (arguments.length === 2 && typeof arguments[0] === 'string' && typeof arguments[1] === 'string') {
            this._redirects[arguments[0]] = arguments[1];
        }
        return this;
    }

    /**
     * Configures and starts a Keystone app in encapsulated mode.
     *
     * Connects to the database, runs updates and listens for incoming requests.
     *
     * Events are fired during initialisation to allow customisation, including:
     *
     *   - onMount
     *   - onStart
     *   - onHttpServerCreated
     *   - onHttpsServerCreated
     *
     * If the events argument is a function, it is assumed to be the started event.
     *
     * @api public
     */
    start(events?) {

        if (typeof events === 'function') {
            events = { onStart: events };
        }
        if (!events) events = {};

        function fireEvent(name) {
            if (typeof events[name] === 'function') {
                events[name]();
            }
        }

        process.on('uncaughtException', function (e) {
            if ((e as any).code === 'EADDRINUSE') {
                console.log(dashes
                    + keystone.get('name') + ' failed to start: address already in use\n'
                    + 'Please check you are not already running a server on the specified port.\n');
                process.exit();
            } else {
                console.log(e.stack || e);
                process.exit(1);
            }
        });

        this.initExpressApp();

        const keystone = this;
        const app = keystone.app;

        this.openDatabaseConnection(function () {

            fireEvent('onMount');

            const ssl = keystone.get('ssl');
            const unixSocket = keystone.get('unix socket');
            const startupMessages = ['KeystoneJS Started:'];

            async.parallel([
                // HTTP Server
                function (done) {
                    if (ssl === 'only' || unixSocket) return done();
                    startHTTPServer(keystone, app, function (err, msg) {
                        fireEvent('onHttpServerCreated');
                        startupMessages.push(msg);
                        done(err);
                    });
                },
                // HTTPS Server
                function (done) {
                    if (!ssl || unixSocket) return done();
                    startSecureServer(keystone, app, function () {
                        fireEvent('onHttpsServerCreated');
                    }, function (err, msg) {
                        startupMessages.push(msg);
                        done(err);
                    });
                },
                // Unix Socket
                function (done) {
                    if (!unixSocket) return done();
                    startSocketServer(keystone, app, function (err, msg) {
                        fireEvent('onSocketServerCreated');
                        startupMessages.push(msg);
                        done(err);
                    });
                },
            ], function serversStarted(err, messages) {
                if (keystone.get('logger')) {
                    console.log(dashes + startupMessages.join('\n') + dashes);
                }
                fireEvent('onStart');
            });
        });

        return this;
    }

    /**
     * Wraps an error in simple HTML to be sent as a response to the browser
     *
     * @api public
     */
    wrapHTMLError(title, err) {
        return "<html><head><meta charset='utf-8'><title>Error</title>"
            + "<link rel='stylesheet' href='/" + this.get('admin path') + "/styles/error.css'>"
            + "</head><body><div class='error'><h1 class='error-title'>" + title + '</h1>'
            + '<div class="error-message">' + (err || '') + '</div></div></body></html>';
    }


    /* Deprecation / Change warnings for 0.4 */
    routes() {
        throw new Error('keystone.routes(fn) has been removed, use keystone.set(\'routes\', fn)');
    }

    //#region options as prototype methods
    // _.extend(Keystone.prototype, libCore.options.bind(this));
    // expandPath, get, getPath, options, set

    /**
     * Expands a path to include moduleRoot if it is relative
     */
    expandPath(pathValue) {
        pathValue = (typeof pathValue === 'string' && pathValue.substr(0, 1) !== path.sep && pathValue.substr(1, 2) !== ':\\')
            ? path.join(this.get('module root'), pathValue)
            : pathValue;
        return pathValue;
    }



    /**
     * Gets keystone options
     *
     * Example:
     *     keystone.get('test') // returns the 'test' value
     */
    get(key): any {
        return this.set(key);
    }


    /**
     * Gets an expanded path option, expanded to include moduleRoot if it is relative
     *
     * Example:
     *     keystone.get('pathOption', 'defaultValue')
     */
    getPath(key, defaultValue) {
        return this.expandPath(this.get(key) || defaultValue);
    }

    /**
     * Sets multiple keystone options.
     *
     * Example:
     *     keystone.options({test: value}) // sets the 'test' option to `value`
     */
    options(options) {
        if (!arguments.length) {
            return this._options;
        }
        if (typeof options === 'object') {
            const keys = Object.keys(options);
            let i = keys.length;
            let k;
            while (i--) {
                k = keys[i];
                this.set(k, options[k]);
            }
        }
        return this._options;
    }

    /**
     * Sets keystone options
     *
     * Example:
     *     keystone.set('user model', 'User') // sets the 'user model' option to `User`
     */
    set(key, value?): Keystone {

        if (arguments.length === 1) {
            return this._options[key];
        }

        switch (key) {
            // throw on unsupported options
            case 'email rules':
                throw new Error('The option "' + key + '" is no longer supported. See https://github.com/keystonejs/keystone/wiki/0.3.x-to-0.4.x-Changes');
            // handle special settings
            case 'cloudinary config':
                const cloudinary = require('cloudinary');
                if (typeof value === 'string') {
                    const parts = url.parse(value, true);
                    const auth = parts.auth ? parts.auth.split(':') : [];
                    value = {
                        cloud_name: parts.host,
                        api_key: auth[0],
                        api_secret: auth[1],
                        private_cdn: parts.pathname !== undefined,
                        secure_distribution: parts.pathname && parts.pathname.substring(1),
                    };
                }
                cloudinary.config(value);
                value = cloudinary.config();
                break;
            case 'auth':
                if (value === true && !this.get('session')) {
                    this.set('session', true);
                }
                break;
            case 'nav':
                this.nav = this.initNav(value);
                break;
            case 'mongo':
                if (typeof value !== 'string') {
                    if (Array.isArray(value) && (value.length === 2 || value.length === 3)) {
                        console.log('\nWarning: using an array for the `mongo` option has been deprecated.\nPlease use a mongodb connection string, e.g. mongodb://localhost/db_name instead.\n\n'
                            + 'Support for arrays as the `mongo` setting will be removed in a future version.');
                        value = (value.length === 2) ? 'mongodb://' + value[0] + '/' + value[1] : 'mongodb://' + value[0] + ':' + value[2] + '/' + value[1];
                    } else {
                        console.error('\nInvalid Configuration:\nThe `mongo` option must be a mongodb connection string, e.g. mongodb://localhost/db_name\n');
                        process.exit(1);
                    }
                }
                break;
            case 'module root':
                // if relative path is used, resolve it based on the caller's path
                if (!isAbsolutePath(value)) {
                    const caller = callerId.getData();
                    value = path.resolve(path.dirname(caller.filePath), value);
                }
                break;
            case 'app':
                this.app = value;
                break;
            case 'mongoose':
                this.mongoose = value;
                break;
            case 'frame guard':
                const validFrameGuardOptions = ['deny', 'sameorigin'];

                if (value === true) {
                    value = 'deny';
                }
                if (typeof value === 'string') {
                    value = value.toLowerCase();
                    if (validFrameGuardOptions.indexOf(value) < 0) {
                        value = false;
                    }
                } else if (typeof value !== 'boolean') {
                    value = false;
                }
                break;
        }

        this._options[key] = value;
        return this;
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
        return this.importer(this.get('module root'))(dirname);
    }

    /**
     * Applies Application updates
     */

    applyUpdates(callback) {
        this.callHook('pre:updates', (err) => {
            if (err) return callback(err);
            applyUpdates(this, (err) => {
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
    static Admin: { Server: { createDynamicRouter: Function, createStaticRouter?: Function } } = {
        Server: undefined
    };
    static Email: typeof Email;
    static Field = FieldBase;
    // static Keystone = Keystone;
    static List: typeof List;
    static Storage = Storage;
    static View: typeof View;

    static content = Content.init(Keystone.instance);
    static security = {
        csrf: csrf,
    };
    static utils = utils;

    /**
     * Keystone version
     */

    static version = require('../package.json').version;


    // Expose Modules
    static session;

    //#endregion

    //#region greplin hooks methods
    pre: (...args) => any;
    //#endregion
}

export const keystone = Keystone.instance;






const MONGO_ID_REGEXP = /^[0-9a-fA-F]{8}[0-9a-fA-F]{6}[0-9a-fA-F]{4}[0-9a-fA-F]{6}$/;

function isMongoId(value) {
    return MONGO_ID_REGEXP.test(value);
}


const dashes = '\n------------------------------------------------\n';





/**
 * This file contains methods specific to dealing with Keystone's options.
 * All exports are added to the Keystone.prototype
 */

// Determines if path is absolute or relative
function isAbsolutePath(value) {
    return path.resolve(value) === path.normalize(value).replace(new RegExp(path.sep + '$'), '');
}





