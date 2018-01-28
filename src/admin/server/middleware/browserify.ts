import * as chalk from 'chalk';
import * as crypto from 'crypto';
import * as fs from 'fs-extra';
import * as moment from 'moment';
import { packages } from '../../client/packages';
import * as path from 'path';

const basedir = path.resolve(__dirname + '/../../client/');
const devMode = process.env.KEYSTONE_DEV === 'true';
const devWriteBundles = process.env.KEYSTONE_WRITE_BUNDLES === 'true';
const devWriteDisc = process.env.KEYSTONE_WRITE_DISC === 'true';

function ts() {
    return chalk.gray(moment().format('YYYY-MM-DD HH:MM:SS '));
}

function logInit(file) {
    console.log(chalk.grey('Watching ') + chalk.underline(file) + chalk.grey(' for changes...'));
}

function logRebuild(file) {
    console.log(ts() + chalk.green('rebuilt ' + chalk.underline(file)));
}

function logError(file, err) {
    console.log(ts() + chalk.red('error building ' + chalk.underline(file) + ':') + '\n' + err.message);
}

export function browserifyMiddleware(opts) {
    const stream = opts.stream;
    const expose = opts.expose;
    const file = opts.file;
    const hash = opts.hash;
    const writeToDisk = opts.writeToDisk;

    let b;
    let building = false;
    const queue = [];
    let src;
    let etag;

    const logName = file.replace(/^\.\//, '');
    const fileName = logName;
    const outputFilename = path.resolve(path.join(__dirname, '../../bundles/js', hash + '-' + fileName));

    function updateBundle(newSrc) {
        src = newSrc;
        etag = crypto.createHash('md5').update(src).digest('hex').slice(0, 6);
    }

    function writeBundle(buff) {
        if (devWriteBundles || writeToDisk) {
            fs.outputFile(outputFilename, buff, 'utf8', function (err) {
                if (err) {
                    return logError(fileName, err);
                }
            });
        }

        if (devWriteDisc) {
            const discFile = fileName.replace('.js', '.html');
            require('disc').bundle(buff, function (err, html) {
                if (err) {
                    logError(discFile, err);
                } else {
                    fs.outputFile(path.resolve(path.join(__dirname, '../../bundles/disc', discFile)), html, 'utf8');
                    console.log(ts() + chalk.green('wrote disc for ' + chalk.underline(file)));
                }
            });
        }
    }

    function build() {
        if (building) return;
        building = true;
        const babelify = require('babelify');
        const browserify = require('browserify');
        const watchify = require('watchify');
        const opts: any = { basedir: basedir };
        if (devMode) {
            logInit(logName);
            opts.debug = true;
            opts.cache = {};
            opts.packageCache = {};
        }
        if (devWriteDisc) {
            opts.fullPaths = true;
        }

        if (stream) {
            b = browserify(opts);
            b.require(stream, { expose: expose });
        } else {
            b = browserify(file, opts);
        }

        b.transform(babelify);
        b.exclude('FieldTypes');
        packages.forEach(function (i) {
            b.exclude(i);
        });

        if (devMode) {
            b = watchify(b, { poll: 500 });
        }

        b.bundle(function (err, buff) {
            if (err) return logError(logName, err);
            updateBundle(buff);
            queue.forEach(function (reqres) {
                send.apply(null, reqres);
            });
            writeBundle(buff);
        });

        b.on('update', function () {
            b.bundle(function (err, buff) {
                if (err) return logError(logName, err);
                else logRebuild(logName);
                updateBundle(buff);
                writeBundle(buff);
            });
        });
    }

    function serve(req, res) {
        if (src) {
            return send(req, res);
        }

        fs.readFile(outputFilename, function (err, data) {
            if (data) {
                updateBundle(data);
                if (devMode) {
                    build();
                }
                send(req, res);
            } else {
                queue.push([req, res]);
                build();
            }
        });
    }

    function send(req, res) {
        res.setHeader('Content-Type', 'application/javascript');

        if (req.get && (etag === req.get('If-None-Match'))) {
            res.status(304);
            res.end();
        } else {
            res.set('ETag', etag);
            res.set('Vary', 'Accept-Encoding');
            res.send(src);
        }
    }

    return {
        serve: serve,
        build: build,
    };
}
