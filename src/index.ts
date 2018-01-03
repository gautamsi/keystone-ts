import { Keystone } from './keystone';
import { Email } from './lib/email';
import * as session from './lib/session';
import { List } from './lib/list';
import * as server from './admin/server';
import { setKeystone } from './lib/session';

/**
 * The exports object is an instance of Keystone.
 */
// const keystone = Keystone.instance;
// export default keystone;

setKeystone(Keystone.instance);
Keystone.Email = Email;
Keystone.session = session;
Keystone.List = List.init(Keystone.instance);
Keystone.Admin.Server = server;

export const keystone = Keystone.instance;

export { Keystone };
