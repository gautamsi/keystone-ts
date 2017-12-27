import * as fs from 'fs';
import * as _debug from 'debug';
const debug = _debug('keystone:core:importer');
import * as path from 'path';

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

export default function dispatchImporter(rel__dirname) {

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
