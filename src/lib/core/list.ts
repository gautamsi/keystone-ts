/**
 * Retrieves a list
 */

export = function list (key) {
	const result = this.lists[key] || this.lists[this.paths[key]];
	if (!result) throw new ReferenceError('Unknown keystone list ' + JSON.stringify(key));
	return result;
}
