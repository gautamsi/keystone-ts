import * as async from 'async';
import * as demand from 'must';
import { RelationshipType } from '../RelationshipType';

export const initList = function (List) {
    List.add({
        single: { type: RelationshipType, ref: List.key },
    });
};

let items;

export const getTestItems = function (List, callback) {
    async.mapValues({
        jed: new List.model({ name: 'Jed' }),
        max: new List.model({ name: 'Max' }),
    }, function (item, key, done) {
        item.save(function (err, doc) {
            if (err) return done(err);
            return done(null, String(doc.id));
        });
    }, function (err, results) {
        if (err) return callback(err);
        items = results;
        callback(null, [
            { single: items.jed },
            { single: items.max },
        ]);
    });
};

export const testFilters = function (List, filter) {

    describe('match', function () {

        it('should find exact matches', function (done) {
            filter({
                single: {
                    value: items.jed,
                },
            }, 'single', true, function (results) {
                demand(results).eql([items.jed]);
                done();
            });
        });

        it('should invert exact matches', function (done) {
            filter({
                single: {
                    inverted: true,
                    value: items.jed,
                },
            }, 'single', true, function (results) {
                demand(results).eql([undefined, undefined, items.max]);
                done();
            });
        });

        it.skip('should find multiple matches', function (done) {
            filter({
                single: {
                    value: [items.jed, items.max],
                },
            }, 'single', true, function (results) {
                demand(results).eql([items.jed, items.max]);
                done();
            });
        });

        it('should find empty relationships', function (done) {
            filter({
                single: {
                    value: '',
                },
            }, 'single', true, function (results) {
                demand(results).eql([undefined, undefined]);
                done();
            });
        });

    });

};
