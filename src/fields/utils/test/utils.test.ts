import * as demand from 'must';
import { addPresenceToQuery } from '../addPresenceToQuery';
import { evalDependsOn } from '../evalDependsOn';

export function testUtils() {
    describe('addPresenceToQuery', function () {
        it('should add $elemMatch if the presence is some', function () {
            const someFilter = { somepath: 'somefilter' };
            const result = addPresenceToQuery('some', someFilter);
            demand(result).eql({
                $elemMatch: someFilter,
            });
        });

        it('should add $not if the presence is none', function () {
            const someFilter = { somepath: 'somefilter' };
            const result = addPresenceToQuery('none', someFilter);
            demand(result).eql({
                $not: someFilter,
            });
        });

        it('should not change anything if no presence is passed', function () {
            const someFilter = { somepath: 'somefilter' };
            const result = addPresenceToQuery('', someFilter);
            demand(result).eql(someFilter);
        });

        it('should not change anything if an invalid presence is passed', function () {
            const someFilter = { somepath: 'somefilter' };
            const result = addPresenceToQuery('invalidstuffhere', someFilter);
            demand(result).eql(someFilter);
        });
    });

    describe('evalDependsOn', function () {
        it('should return true if dependsOn is not an object', function () {
            demand(evalDependsOn()).be.true();
        });

        it('should return true if dependsOn is an empty object', function () {
            demand(evalDependsOn({})).be.true();
        });

        it('should return true if the current field depends on another field, and that field has the value we want', function () {
            demand(evalDependsOn({
                name: 'Max',
            }, {
                    name: 'Max',
                })).be.true();
        });

        it('should return false if the current field depends on another field, and that field does not have the value we want', function () {
            demand(evalDependsOn({
                name: 'Max',
            }, {
                    name: 'Jed',
                })).be.false();
        });

        it('should return false if the current field depends on another field, and that field is undefined', function () {
            demand(evalDependsOn({
                name: 'Max',
            }, {
                    notname: 'Max',
                })).be.false();
        });
    });
}
