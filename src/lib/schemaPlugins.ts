export { sortable } from './schemaPlugins/sortable';
export { autokey } from './schemaPlugins/autokey';
export { track } from './schemaPlugins/track';
export { history } from './schemaPlugins/history';

import { getRelated } from './schemaPlugins/methods/getRelated';
import { populateRelated } from './schemaPlugins/methods/populateRelated';

import { transform } from './schemaPlugins/options/transform';

export const methods = {
    getRelated,
    populateRelated
};

export const options = {
    transform
};
