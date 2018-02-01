const demand = require('must');
const proxyquire = require('proxyquire');
import { safeRequire } from '../../../src/lib/safeRequire';

describe('safeRequire', function () {
    describe('given a library that is not installed', function () {
        beforeEach(function () {
            this.oldExit = process.exit;
            process.exit = function (status) {
                return demand(status).eql(1);
            } as any;
        });

        afterEach(function () {
            process.exit = this.oldExit;
        });

        it('throws an error highlighting that the library is not installed', function () {
            try {
                safeRequire('foobarbaz', 'foobarbaz');
            } catch (e) {
                demand(e.message).contain('foobarbaz');
            }
        });
    });

    describe('given a library that exists', function () {
        it('returns the required library', function () {
            const localDemand = safeRequire('must', 'must');
            localDemand(1).eql(1);
        });
    });
});
