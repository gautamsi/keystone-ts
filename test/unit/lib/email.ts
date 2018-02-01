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
        Email = proxyquire('../../../src/lib/email', { 'keystone-email': keystoneEmail });
    });

	/**
	 * TESTS
	 */
    it('should require options to be passed in', function () {
        demand(Email).throw(/requires a templateName or options argument/);
    });

    it('should require keystone-email to be installed', function () {
        // Pretend keystone-email isn't installed for this test
        let Email = proxyquire('../../../lib/email', { 'keystone-email': null });
        try {
            Email({});
        } catch (err) {
            demand(err.message).contain('keystone-email');
        }
    });

    it('should return an instance of keystone-email', function () {
        demand(Email({})).instanceof(keystoneEmail);
    });

    it('should allow a string to be passed in as the template name', function () {
        let templateName = 'templatename';
        Email(templateName);
        demand(keystoneEmail.calledOnce).true();
        demand(keystoneEmail.getCall(0).args[0]).eql(templateName);
    });

    it('should pass on the options passed in', function () {
        let options = { some: 'options' };
        Email(options);
        demand(keystoneEmail.calledOnce).true();
        demand(keystoneEmail.getCall(0).args[1]).eql(options);
    });
});
