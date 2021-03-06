import * as multer from 'multer';
import * as bodyParser from 'body-parser';

export function bindBodyParser(keystone, app) {
    // Set up body options and cookie parser
    const bodyParserParams: any = {};
    if (keystone.get('file limit')) {
        bodyParserParams.limit = keystone.get('file limit');
    }
    app.use(bodyParser.json(bodyParserParams));
    bodyParserParams.extended = true;
    app.use(bodyParser.urlencoded(bodyParserParams));
    app.use(multer({
        includeEmptyFields: true,
    }));
}
