import * as fs from 'fs';
import { keystone, Keystone } from '../../src/index';
import * as path from 'path';

keystone.init({});

let typesLoc = path.resolve('src/fields/types');
let types = fs.readdirSync(typesLoc);

types.forEach(function (name) {
    let typeTestPath = typesLoc + '/' + name + '/test/type.ts';
    if (!fs.existsSync(typeTestPath)) return;

    // nocreate option prevents warnings for required / not initial fields
    let List = new Keystone.List(name + 'Test', { nocreate: true });
    let test = require(typeTestPath);

    test.initList(List);
    List.register();
    describe('FieldType: ' + name.substr(0, 1).toUpperCase() + name.substr(1), function () {
        before(function (done) {
            List.model.remove().exec(done);
        });
        test.testFieldType(List);
    });
});
