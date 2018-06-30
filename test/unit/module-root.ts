import { keystone } from '../../src/index';
import * as demand from 'must';
import * as path from 'path';
import { getExpressApp } from '../helpers/getExpressApp';

describe('Keystone "module root" setting', function () {

    before(function () {
        getExpressApp();
    });

    describe('default', function () {

        it('should be set to the path where keystone was required', function () {
            demand(keystone.get('module root')).to.be.equal(__dirname);
        });

        it('should be used by keystone.getPath()', function () {
            let viewsPath = 'relative/path/to/views';
            keystone.set('views', viewsPath);
            demand(keystone.getPath('views', undefined)).to.be.equal(path.resolve(__dirname, viewsPath));
        });

    });

    describe('custom with relative path', function () {
        let customPath = '../..';

        before(function () {
            keystone.set('module root', customPath + '/..'); // ref: needed to add '/..' otherwise it does not use it correctly.
        });

        it('should return the custom configured path', function () {
            demand(keystone.get('module root')).to.be.equal(path.resolve(__dirname, customPath));
        });

        it('should be used by keystone.getPath() to resolve relative paths', function () {
            let viewsPath = 'relative/path/to/views';
            keystone.set('views', viewsPath);
            demand(keystone.getPath('views', undefined)).to.be.equal(path.resolve(__dirname, customPath, viewsPath));
        });
    });

    describe('custom with absolute path', function () {
        let customPath = path.resolve(__dirname, '../..');

        before(function () {
            keystone.set('module root', customPath);
        });

        it('should return the custom configured path', function () {
            demand(keystone.get('module root')).to.be.equal(customPath);
        });

        it('should be used by keystone.getPath() to resolve relative paths', function () {
            let viewsPath = 'relative/path/to/views';
            keystone.set('views', viewsPath);
            demand(keystone.getPath('views', undefined)).to.be.equal(path.resolve(customPath, viewsPath));
        });
    });
});
