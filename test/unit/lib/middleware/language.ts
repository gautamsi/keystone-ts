import * as demand from 'must';
import * as sinon from 'sinon';
import * as assign from 'object-assign';
import { language } from '../../../../src//lib/middleware/language';

const COOKIE_NAME_ARG = 0;
const COOKIE_LANGUAGE_ARG = 1;

function getNoop() { return function noop() { }; }

function mockRequest(acceptLanguage?, storedLanguage?) {
    let args = [].slice.call(arguments);
    let options = typeof args[0] === 'object' ? args[0] : {};

    if (Object.keys(options).length) {
        acceptLanguage = options.acceptLanguage;
    }

    return assign({
        locals: {},
        headers: {
            'accept-language': acceptLanguage
        },
        cookies: {
            language: storedLanguage
        },
        query: {},
        cookie: getNoop()
    }, options);
}

function mockResponse() {
    return {
        redirect: sinon.spy(),
        cookie: sinon.spy()
    };
}

function keystoneOptions(options?) {
    options = assign({}, options);

    return {
        get: function (key) {
            return options[key];
        }
    };
}

function mockApp() {
    return {
        use: sinon.spy()
    };
}

function getCookieName(res) {
    return res.cookie.getCall(0).args[COOKIE_NAME_ARG];
}

function getCookieLanguage(res) {
    return res.cookie.getCall(0).args[COOKIE_LANGUAGE_ARG];
}

describe('language', function () {
    it('must allow Accept-Language selection', function () {
        let keystone = keystoneOptions({
            'language options': {
                'supported languages': ['en-US', 'zh-CN']
            }
        });
        let expected = 'zh-CN';
        let req = mockRequest({
            acceptLanguage: 'zh-CN;q=1,en-US;q=0.8'
        });
        let res = mockResponse();
        let middleware = language(keystone);

        middleware(req, res, getNoop());

        demand(getCookieLanguage(res)).eql(expected);
    });

    describe('must set language', function () {
        describe('with default options', function () {

            it('must create a language cookie', function (done) {

                let keystone = keystoneOptions();
                let res = mockResponse();
                let expected = 'en-US';

                language(keystone)(mockRequest(), res, function (err) {
                    demand(err).be.undefined();
                    demand(getCookieLanguage(res)).eql(expected);
                    done();
                });
            });

        });

        describe('with custom cookie name', function () {
            it('must create a custom language cookie', function (done) {

                let keystone = keystoneOptions({
                    'language options': {
                        'language cookie': 'locale'
                    }
                });
                let res = mockResponse();
                let expected = 'locale';

                language(keystone)(mockRequest(), res, function (err) {
                    demand(err).be.undefined();
                    demand(getCookieName(res)).eql(expected);
                    done();
                });
            });

        });
    });

    describe('must create language route', function () {
        describe('with default options', function () {
            it('must create /language route to change language', function () {

                let keystone = keystoneOptions();
                let req = mockRequest({
                    acceptLanguage: 'zh-CN;q=0.8,en-US;q=1',
                    storedLanguage: 'zh-CN',
                    url: '/languages/en-US'
                });
                let res = mockResponse();
                let middleware = language(keystone);
                let expected = 'en-US';

                middleware(req, res, getNoop());

                demand(res.redirect.calledOnce).eql(true);
                demand(res.cookie.calledOnce).eql(true);
                demand(getCookieLanguage(res)).eql(expected);
            });
        });

        describe('with default options', function () {
            it('must create custom route to change language', function () {

                let keystone = keystoneOptions({
                    'language options': {
                        'language select url': '/locale/{language}'
                    }
                });
                let req = mockRequest({
                    acceptLanguage: 'zh-CN;q=0.8,en-US;q=1',
                    storedLanguage: 'zh-CN',
                    url: '/locale/en-US'
                });
                let res = mockResponse();
                let middleware = language(keystone);
                let expected = 'en-US';

                middleware(req, res, getNoop());

                demand(res.redirect.calledOnce).eql(true);
                demand(res.cookie.calledOnce).eql(true);
                demand(getCookieLanguage(res)).eql(expected);
            });
        });
    });

    describe('query string language setting', function () {
        describe('with default query name', function () {
            it('must allow query string language setting', function () {
                let keystone = keystoneOptions({
                    'language options': {
                        'supported languages': ['en-US', 'zh-CN']
                    }
                });
                let expected = 'en-US';
                let req = mockRequest({
                    acceptLanguage: 'zh-CN;1,en-US;q=0.8',
                    query: {
                        language: 'en-US'
                    }
                });
                let res = mockResponse();
                let middleware = language(keystone);

                middleware(req, res, getNoop());

                demand(getCookieLanguage(res)).eql(expected);
            });
        });

        describe('with custom query name', function () {
            it('must allow query string language setting', function () {
                let keystone = keystoneOptions({
                    'language options': {
                        'supported languages': ['en-US', 'zh-CN'],
                        'language query name': 'locale'
                    }
                });
                let expected = 'en-US';
                let req = mockRequest({
                    acceptLanguage: 'zh-CN;1,en-US;q=0.8',
                    query: {
                        locale: 'en-US'
                    }
                });
                let res = mockResponse();
                let middleware = language(keystone);

                middleware(req, res, getNoop());

                demand(getCookieLanguage(res)).eql(expected);
            });
        });
    });
});
