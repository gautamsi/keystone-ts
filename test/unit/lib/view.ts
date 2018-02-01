import * as demand from 'must';
import * as request from 'supertest';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import { Keystone } from '../../../src/index';

let getApp = function () {
    let app = keystone.express;
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(methodOverride());
    return app;
};

describe('Keystone.View', function () {

    describe('new', function () {
        it('must be an instance of View', function (done) {
            let app = getApp();
            app.get('/', function (req, res) {
                let view = new Keystone.View(req, res);
                view.must.be.an.instanceof(keystone.View);
                res.send('OK');
            });
            request(app)
                .get('/')
                .expect('OK', done);
        });
    });

    describe('.render(callback)', function () {
        it('must call the callback function', function (done) {
            let app = getApp();
            app.get('/', function (req, res) {
                let view = new keystone.View(req, res);
                view.render(function () {
                    res.send('OK');
                });
            });
            request(app)
                .get('/')
                .expect('OK', done);
        });
    });

    describe('.render(callback)', function () {
        it('must pass (err, req, res) to the callback', function (done) {
            let app = getApp();
            app.get('/', function (req, res) {
                let view = new keystone.View(req, res);
                view.render(function (err, req2, res2) {
                    demand(err).not.exist();
                    req2.must.equal(req);
                    res2.must.equal(res);
                    res.send('OK');
                });
            });
            request(app)
                .get('/')
                .expect('OK', done);
        });
    });

    describe('.on(event, [match,] fn)', function () {

        it('must call init methods first', function (done) {
            let app = getApp();
            app.get('/', function (req, res) {
                let view = new keystone.View(req, res);
                let status = 'NOT OK';
                view.on('init', function (next) {
                    status = 'OK';
                    next();
                });
                view.render(function () {
                    res.send(status);
                });
            });
            request(app)
                .get('/')
                .expect('OK', done);
        });

        function getApp_getAndPost() {
            let app = getApp();
            app.all('/', function (req, res) {
                let view = new keystone.View(req, res);
                let status = 'OK';
                view.on('get', function (next) {
                    status = 'OK GET';
                    next();
                });
                view.on('post', function (next) {
                    status = 'OK POST';
                    next();
                });
                view.render(function () {
                    res.send(status);
                });
            });
            return app;
        }

        it('must call get actions correctly', function (done) {
            request(getApp_getAndPost())
                .get('/')
                .expect('OK GET', done);
        });

        it('must call post actions correctly', function (done) {
            request(getApp_getAndPost())
                .post('/')
                .expect('OK POST', done);
        });

        function getApp_conditionalGet() {
            let app = getApp();
            app.get('/', function (req, res) {
                let view = new keystone.View(req, res);
                let status = 'OK';
                view.on('get', { test: 'yes' }, function (next) {
                    status = 'OK GET';
                    next();
                });
                view.render(function () {
                    res.send(status);
                });
            });
            return app;
        }

        it('must invoke get actions with matching query parameters', function (done) {
            request(getApp_conditionalGet())
                .get('/?test=yes')
                .expect('OK GET', done);
        });

        it('must skip get actions without matching query parameters', function (done) {
            request(getApp_conditionalGet())
                .get('/')
                .expect('OK', done);
        });

        function getApp_conditionalPostValue() {
            let app = getApp();
            app.post('/', function (req, res) {
                let view = new keystone.View(req, res);
                let status = 'OK';
                view.on('post', { test: 'yes' }, function (next) {
                    status = 'OK POST';
                    next();
                });
                view.render(function () {
                    res.send(status);
                });
            });
            return app;
        }

        it('must invoke post actions with matching body data', function (done) {
            request(getApp_conditionalPostValue())
                .post('/')
                .send({ test: 'yes' })
                .expect('OK POST', done);
        });

        it('must skip post actions with non-matching body data', function (done) {
            request(getApp_conditionalPostValue())
                .post('/')
                .send({ test: 'no' })
                .expect('OK', done);
        });

        function getApp_conditionalPostTruthy() {
            let app = getApp();
            app.post('/', function (req, res) {
                let view = new keystone.View(req, res);
                let status = 'OK';
                view.on('post', { test: true }, function (next) {
                    status = 'OK POST';
                    next();
                });
                view.render(function () {
                    res.send(status);
                });
            });
            return app;
        }

        it('must invoke post actions with body data present', function (done) {
            request(getApp_conditionalPostTruthy())
                .post('/')
                .send({ test: 'yes' })
                .expect('OK POST', done);
        });

        it('must skip post actions without matching body data', function (done) {
            request(getApp_conditionalPostTruthy())
                .post('/')
                .expect('OK', done);
        });

        function getApp_extRequest() {
            let app = getApp();
            app.get('/', function (req, res) {
                req.ext = { prop: 'value' };
                let view = new keystone.View(req, res);
                let status = 'NOT OK';
                view.on({ 'ext.prop': 'value' }, function (next) {
                    status = 'OK';
                    next();
                });
                view.render(function () {
                    res.send(status);
                });
            });
            return app;
        }

        it('must invoke actions based on req properties', function (done) {
            request(getApp_extRequest())
                .get('/')
                .expect('OK', done);
        });

    });

});
