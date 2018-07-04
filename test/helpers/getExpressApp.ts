import { keystone } from '../../src/index';
import mongoose from './getMongooseConnection';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';

export function getExpressApp() {
    let app;

    keystone.init({
        'mongoose': mongoose
    });
    app = keystone.express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(methodOverride());

    return app;
}

