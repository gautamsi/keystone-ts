
export function initViewLocals(keystone, app) {
    // Apply locals
    if (typeof keystone.get('locals') === 'object') {
        Object.assign(app.locals, keystone.get('locals'));
    }

    // Default "pretty html" mode except in production
    // Only if it has not been specified in the locals setting
    if (app.locals.pretty === undefined && keystone.get('env') !== 'production') {
        app.locals.pretty = true;
    }
}
