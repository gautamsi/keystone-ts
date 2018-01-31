import * as _ from 'lodash';
import * as fs from 'fs';
import { keystone, Keystone } from '../../src/index';
import * as path from 'path';

keystone.init({});

let typesLoc = path.resolve('src/fields/types');
let types = fs.readdirSync(typesLoc);

function stringifyValue(value) {
    if (Array.isArray(value)) {
        return value.map(stringifyValue);
    }
    return value !== undefined ? String(value) : value;
}

types.forEach(function (name) {
    let filtersTestPath = typesLoc + '/' + name + '/test/filters.ts';
    console.log(filtersTestPath);
    if (!fs.existsSync(filtersTestPath)) return;

    let listKey = name + 'FiltersTest';

    // nocreate option prevents warnings for required / not initial fields
    let List = new Keystone.List(listKey, { nocreate: true });
    let test = require(filtersTestPath);

    test.initList(List);
    List.register();

    let filter = function (filters, prop, stringify, callback) {
        if (typeof stringify === 'function' && !callback) {
            callback = stringify;
            stringify = false;
        }
        if (typeof prop === 'function' && !callback) {
            callback = prop;
            prop = null;
        }
        let where = List.addFiltersToQuery(filters);
        List.model.find(where, function (err, results) {
            if (prop) {
                results = _.map(results, prop);
                if (stringify) {
                    results = results.map(stringifyValue);
                }
            }
            callback(results);
        });
    };

    describe('FieldType: ' + name.substr(0, 1).toUpperCase() + name.substr(1) + ': Filter', function () {
        before(function (done) {
            List.model.remove().exec(function (err) {
                if (err) throw err;
                let testItems = {};
                if (test.getTestItems.length < 2) {
                    testItems[listKey] = test.getTestItems(List);
                    return keystone.createItems(testItems, done);
                } else {
                    test.getTestItems(List, function (err, data) {
                        if (err) throw err;
                        testItems[listKey] = data;
                        keystone.createItems(testItems, done);
                    });
                }
            });
        });
        test.testFilters(List, filter);
    });
});
