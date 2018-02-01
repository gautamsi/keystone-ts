import * as express from 'express';
import * as demand from 'must';

import * as  ReactEngine from 'react-engine';
import * as  view from 'react-engine/lib/expressView';

let engine = ReactEngine.server.create({});

import { initViewEngine } from '../../../src/server/initViewEngine';

import { keystone } from '../../../src/index';

let options = {

    'name': 'foo',
    'brand': 'foo',

    'less': 'public',
    'static': 'public',
    'favicon': 'public/favicon.ico',
    'views': 'templates/views',
    'view engine': '.jsx',
    'custom engine': engine,
    'view': view,

    'auto update': true,
    'session': true,
    'auth': true,
    'user model': 'User',
    'cookie secret': 'Secret',

};

describe('initViewEngine', function () {
    let app = express();
    keystone.init(options);
    keystone.set('app', app);
    it('should set view', function () {
        demand(typeof app.get('view')).must.be.equal('function');
    });
});
