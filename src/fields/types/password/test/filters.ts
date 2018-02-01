import * as demand from 'must';
import { PasswordType } from '../PasswordType';

export const initList = function (List) {
    List.add({
        password: PasswordType,
    });
};

export const getTestItems = function () {
    return [
        {},
        { password: '' },
        { password: ' ' },
        { password: null },
        { password: 'abc123' },
        { password: 'ABC123' },
    ];
};

export const testFilters = function (List, filter) {
    it('should filter for existance', function (done) {
        filter({
            password: {
                exists: true,
            },
        }, 'password', function (results) {
            demand(results.length).eql(3);
            // Make sure the passwords are hashed by checking that the length
            // of the returned strings is above the longest password specified
            // above
            demand(results[0].length).above(6);
            demand(results[1].length).above(6);
            demand(results[2].length).above(6);
            done();
        });
    });

    it('should filter for non-existance', function (done) {
        filter({
            password: {
                exists: false,
            },
        }, 'password', function (results) {
            demand(results.length).eql(3);
            demand(results[0]).be.undefined();
            demand(results[1]).be.undefined();
            demand(results[2]).be.undefined();
            done();
        });
    });
};
