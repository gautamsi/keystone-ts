import * as _debug from 'debug';
import { ipRangeRestrict } from '../lib/security/ipRangeRestrict';
const debug = _debug('keystone:server:bindIpRestrictions');

export function bindIPRestrictions(keystone, app) {
    // Check for IP range restrictions
    if (keystone.get('allowed ip ranges')) {
        if (!app.get('trust proxy')) {
            console.log(
                'KeystoneJS Initialisaton Error:\n\n'
                + 'to set IP range restrictions the "trust proxy" setting must be enabled.\n\n'
            );
            process.exit(1);
        }
        debug('adding IP ranges', keystone.get('allowed ip ranges'));
        app.use(ipRangeRestrict(
            keystone.get('allowed ip ranges'),
            keystone.wrapHTMLError
        ));
    }
}
