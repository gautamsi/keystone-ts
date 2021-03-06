import { keystone } from '../../../../src/index';
import * as demand from 'must';
import * as request from 'supertest';
import { getExpressApp } from '../../../helpers/getExpressApp';
let app = getExpressApp();
import { frameGuard } from '../../../../src/lib/security/frameGuard';

describe('Keystone "frame guard" setting', function () {
    before(function () {
        app.use(frameGuard(keystone));
        app.get('/', function (req, res) {
            res.send('OK');
        });
    });

    describe('default setting', function () {

        it('should be "sameorigin"', function () {
            demand(keystone.get('frame guard')).to.be.equal('sameorigin');
        });

    });

    describe('keystone.set("frame guard")', function () {

        it('should allow setting to "sameorigin"', function () {
            keystone.set('frame guard', 'sameorigin');
            demand(keystone.get('frame guard')).to.be.equal('sameorigin');
        });

        it('should allow setting to "deny"', function () {
            keystone.set('frame guard', 'deny');
            demand(keystone.get('frame guard')).to.be.equal('deny');
        });

        it('should allow setting to TRUE, converts to "deny"', function () {
            keystone.set('frame guard', true);
            demand(keystone.get('frame guard')).to.be.equal('deny');
        });

        it('should allow setting to FALSE', function () {
            keystone.set('frame guard', false);
            demand(keystone.get('frame guard')).to.be.equal(false);
        });

        it('should translate invalid options to FALSE', function () {
            keystone.set('frame guard', 'xxx');
            demand(keystone.get('frame guard')).to.be.equal(false);
            keystone.set('frame guard', 999);
            demand(keystone.get('frame guard')).to.be.equal(false);
            keystone.set('frame guard', []);
            demand(keystone.get('frame guard')).to.be.equal(false);
            keystone.set('frame guard', {});
            demand(keystone.get('frame guard')).to.be.equal(false);
        });

    });

    describe('X-Frame-Options header', function () {

        it('should be set to "deny" when "frame guard" is "deny"', function (done) {
            keystone.set('frame guard', 'deny');
            request(app)
                .get('/')
                .expect('x-frame-options', 'deny')
                .expect(200, done);
        });

        it('should be set to "sameorigin" when "frame guard" is "sameorigin"', function (done) {
            keystone.set('frame guard', 'sameorigin');
            request(app)
                .get('/')
                .expect('x-frame-options', 'sameorigin')
                .expect(200, done);
        });

        it('should be set to "deny" when "frame guard" is TRUE', function (done) {
            keystone.set('frame guard', true);
            request(app)
                .get('/')
                .expect('x-frame-options', 'deny')
                .expect(200, done);
        });

        it('should not be set when "frame guard" is FALSE', function (done) {
            keystone.set('frame guard', false);
            request(app)
                .get('/')
                .expect(function (res) {
                    if (res.headers['x-frame-options']) {
                        return 'X-Frame-Options key exists';
                    }
                })
                .expect(200, done);
        });

    });

});
