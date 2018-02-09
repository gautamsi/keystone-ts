import * as async from 'async';
import { keystone } from '../../src/index';
import * as ReactEngine from 'react-engine';
const engine = ReactEngine.server.create({});
import * as request from 'superagent';
import * as moment from 'moment';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as keystoneNightwatchE2e from 'keystone-nightwatch-e2e';

// Set app-specific env for nightwatch session
process.env.KNE_TEST_PATHS = 'test-dist/test/e2e/adminUI/tests';
process.env.KNE_EXCLUDE_TEST_PATHS = 'test-dist/test/e2e/adminUI/tests/group006Fields/commonFieldTestUtils.js,test-dist/test/e2e/adminUI/tests/group999FixMe/*';

// determine the mongo uri and database name
let dbName = '/e2e' + (process.env.KEYSTONEJS_PORT || 3000);
let mongoUri = 'mongodb://' + (process.env.KEYSTONEJS_HOST || 'localhost') + dbName;

// Function that drops the test database before starting testing
function dropTestDatabase(done) {
    console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: dropping test database: ' + mongoUri);

    mongoose.connect(mongoUri, function (err) {
        if (!err) {
            mongoose.connection.db.dropDatabase(function (err) {
                if (!err) {
                    console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: dropped test database: ' + mongoUri);
                }
                mongoose.connection.close(function (err) {
                    done(err);
                });
            });
        } else {
            console.error([moment().format('HH:mm:ss:SSS')] + ' e2e: failed to connect to mongo: ' + err);
            done(err);
        }
    });
}

// Function that checks if keystone is ready before starting testing
function checkKeystoneReady(done) {
    async.retry({
        times: 10,
        interval: 3000
    }, function (done, result) {
        console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: checking if KeystoneJS ready for request');
        request
            .get('http://' + keystone.get('host') + ':' + keystone.get('port') + '/keystone')
            .end(done);
    }, function (err, result) {
        if (!err) {
            console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: KeystoneJS Ready!');
            done();
        } else {
            console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: KeystoneJS does not appear ready!');
            done(err);
        }
    });
}

// Function that starts the e2e common framework
function runE2E(options, done) {
    console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: starting tests...');

    keystoneNightwatchE2e.startE2E(options, done);
}

// Function that starts keystone
function runKeystone(cb) {
    console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: starting KeystoneJS...');

    // initialize keystone
    keystone.init({
        'name': 'e2e',
        'brand': 'e2e',

        'host': process.env.KEYSTONEJS_HOST || 'localhost',
        'port': process.env.KEYSTONEJS_PORT || 3000,

        'mongo': mongoUri,

        'static': 'frontend',
        'favicon': 'adminuiCustom/favicon.ico',
        'less': 'frontend',
        'views': 'frontend',
        'view engine': 'pug',

        'auto update': true,
        'session': true,
        'auth': true,
        'user model': 'User',
        'cookie secret': 'Secret',
        'adminui custom styles': 'adminuiCustom/styles.less',

        'cloudinary config': 'cloudinary://api_key:api_secret@cloud_name',
    });

    // import app models
    keystone.import('models');

    // setup any custom routes
    keystone.set('routes', require('./routes'));

    // setup application adminui navigation
    keystone.set('nav', {
        'access': [
            'users',
        ],
        'fields': [
            'booleans',
            'cloudinary-images',
            'cloudinary-image-multiples',
            'codes',
            'colors',
            'dates',
            'date-arrays',
            'datetimes',
            'emails',
            'files',
            'geo-points',
            'htmls',
            'keys',
            'locations',
            'markdowns',
            'money',
            'names',
            'numbers',
            'number-arrays',
            'passwords',
            'relationships',
            'selects',
            'texts',
            'text-arrays',
            'textareas',
            'urls',
        ],
        'Miscs': [
            'date-field-maps',
            'depends-ons',
            'no-default-columns',
            'inline-relationships',
            'many-relationships',
            'hidden-relationships',
            'source-relationships',
            'target-relationships',
        ]
    });

    keystone.start({
        onMount: function () {
            console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: KeystoneJS mounted Successfuly');
        },
        onStart: function () {
            console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: KeystoneJS Started Successfully');
            cb();
        },
    });
}

// Function that bootstraps the e2e test service
function start() {
    let runTests = process.argv.indexOf('--notest') === -1;
    let dropDB = process.argv.indexOf('--nodrop') === -1;

    async.series([

        function (cb) {
            if (dropDB) {
                dropTestDatabase(cb);
            } else {
                cb();
            }
        },

        function (cb) {
            runKeystone(cb);
        },

        function (cb) {
            checkKeystoneReady(cb);
        },

        function (cb) {
            if (runTests) {
                runE2E({
                    keystone: keystone
                }, cb);
            } else {
                cb();
            }
        }

    ], function (err) {
        let exitProcess = false;
        let exitCode = 0;
        if (err) {
            console.error([moment().format('HH:mm:ss:SSS')] + ' e2e: ' + err);
            exitProcess = true;
            exitCode = 1;
        }
        if (runTests) {
            exitProcess = true;
        }
        if (exitProcess) {
            console.error([moment().format('HH:mm:ss:SSS')] + ' e2e: exiting');
            process.exit(exitCode);
        }
    });
}

start();
