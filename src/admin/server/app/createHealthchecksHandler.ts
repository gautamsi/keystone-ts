import { safeRequire } from '../../../lib/safeRequire';

export function createHealthchecksHandler(keystone) {
    const healthcheck = safeRequire('keystone-healthchecks', 'healthchecks');
    let healthcheckConfig = keystone.get('healthchecks');

    if (healthcheckConfig === true) {
        healthcheckConfig = {};
        // By default, we simply bind the user model healthcheck if there is a
        // user model. This validates we can successfully query the database.
        if (keystone.get('user model')) {
            const User = keystone.list(keystone.get('user model'));
            healthcheckConfig.canQueryUsers = healthcheck.healthchecks.canQueryListFactory(User);
        }
    }

    return healthcheck.createRoute(healthcheckConfig);
}
