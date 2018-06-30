import * as demand from 'must';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

describe('Email', function () {
	/**
	 * SETUP
	 */
    let keystoneEmail;
    let Email;

    beforeEach(function () {
        // Make the tests work no matter if keystone-email is installed or not, spying on the mocked
        // keystone-email
        keystoneEmail = sinon.spy();
        Email = proxyquire('../../../src/lib/email', { 'keystone-email': keystoneEmail }).Email;
    });

	/**
	 * TESTS
	 */
    it('should require options to be passed in', function () {
        demand(() => { new Email(); }).throw(/requires a templateName or options argument/);
    });
});
