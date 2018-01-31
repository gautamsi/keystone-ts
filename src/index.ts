import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as createClass from 'create-react-class';

// (React as any).PropTypes = PropTypes;
// (React as any).createClass = createClass;
import * as utils from 'keystone-utils';


import { Keystone } from './keystone';
import { Email } from './lib/email';
import * as session from './lib/session';
import { List } from './lib/list';
import * as server from './admin/server';
import { setKeystone } from './lib/session';
import { FieldTypes } from './fields/types';
import * as path from 'path';
import { View } from './lib/view';

/**
 * Don't use process.cwd() as it breaks module encapsulation
 * Instead, let's use module.parent if it's present, or the module itself if there is no parent (probably testing keystone directly if that's the case)
 * This way, the consuming app/module can be an embedded node_module and path resolutions will still work
 * (process.cwd() breaks module encapsulation if the consuming app/module is itself a node_module)
 */
let moduleRoot = (function (_rootPath) {
    let parts = _rootPath.split(path.sep);
    parts.pop(); // get rid of /node_modules from the end of the path
    return parts.join(path.sep);
})(module.parent ? module.parent.paths[0] : module.paths[0]);


Keystone.instance.set('module root', moduleRoot);


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
Keystone.View = View;
Keystone.utils = utils;
export const keystone = Keystone.instance;

// old code compatibility
(keystone as any).Field = {};
(keystone as any).Field.Types = FieldTypes;
export { Keystone };

export { FieldTypes, List };
