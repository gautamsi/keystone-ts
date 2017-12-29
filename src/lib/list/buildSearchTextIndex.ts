/**
 * Returns either false if the list has no search fields defined or a structure
 * describing the text index that should exist.
 */
export function buildSearchTextIndex () {
	const idxDef = {};

	for (let i = 0; i < this.searchFields.length; i++) {
		const sf = this.searchFields[i];
		if (!sf.path || !sf.field) continue;

		// TODO: Allow fields to define their own `getTextIndex` method, so that
		// each type can define the right options for their schema. This is unlikely
		// to behave as expected for fields that aren't simple strings or names
		// until that has been done. Should error if the field type doesn't support
		// text indexing, as the list has been misconfigured.

		// Does the field have a single path or does it use nested values (like 'name')
		if (sf.field.paths) {
			const nFields = sf.field.paths;
			const nKeys = Object.keys(nFields);
			for (let n = 0; n < nKeys.length; n++) {
				idxDef[nFields[nKeys[n]]] = 'text';
			}
		}
		else if (sf.field.path) {
			idxDef[sf.field.path] = 'text';
		}
	}

	// debug('text index for \'' + this.key + '\':', idxDef);
	return Object.keys(idxDef).length > 0 ? idxDef : false;
}
