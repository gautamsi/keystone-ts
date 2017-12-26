export { sortable} from './schemaPlugins/sortable';
export const autokey = require('./schemaPlugins/autokey');
export const track = require('./schemaPlugins/track');
export const history = require('./schemaPlugins/history');

export const methods = {
	getRelated: require('./schemaPlugins/methods/getRelated'),
	populateRelated: require('./schemaPlugins/methods/populateRelated'),
};

export const options = {
	transform: require('./schemaPlugins/options/transform'),
};
