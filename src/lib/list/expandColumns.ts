import * as utils from 'keystone-utils';
import * as _ from 'lodash';

/**
 * Expands a comma-separated string or array of columns into valid column objects.
 *
 * Columns can be:
 *    - A Field, in the format "field|width"
 *    - A Field in a single related List, in the format "list:field|width"
 *    - Any valid path in the Schema, in the format "path|width"
 *
 * The width part is optional, and can be in the format "n%" or "npx".
 *
 * The path __name__ is automatically mapped to the namePath of the List.
 *
 * The field or path for the name of the item (defaults to ID if not set or detected)
 * is automatically prepended if not explicitly included.
 */
export function expandColumns (cols) {
	if (typeof cols === 'string') {
		cols = cols.split(',');
	}
	if (!Array.isArray(cols)) {
		throw new Error('List.expandColumns: cols must be an array.');
	}
	const list = this;
	const expanded = [];
	let nameCol = false;
	const getCol = function (def) {
		if (def.path === '__name__') {
			def.path = list.namePath;
		}
		const field = list.fields[def.path];
		let col = null;
		if (field) {
			col = {
				field: field,
				path: field.path,
				type: field.type,
				label: def.label || field.label,
			};
			if (col.type === 'relationship') {
				col.refList = col.field.refList;
				if (col.refList) {
					col.refPath = def.subpath || col.refList.namePath;
					col.subField = col.refList.fields[col.refPath];
					col.populate = { path: col.field.path, subpath: col.refPath };
				}
				if (!def.label && def.subpath) {
					col.label = field.label + ': ' + (col.subField ? col.subField.label : utils.keyToLabel(def.subpath));
				}
			}
		} else if (list.model.schema.paths[def.path] || list.model.schema.virtuals[def.path]) {
			// column refers to a path in the schema
			// TODO: this needs to handle sophisticated types, including arrays, nested Schemas, and mixed types
			col = {
				path: def.path,
				label: def.label || utils.keyToLabel(def.path),
			};
		}
		if (col) {
			col.width = def.width;
			if (col.path === list.namePath) {
				col.isName = true;
				nameCol = col;
			}
			if (field && field.col) {
				_.extend(col, field.col);
			}
		}
		return col;
	};
	for (let i = 0; i < cols.length; i++) {
		const def: any = {};
		if (typeof cols[i] === 'string') {
			let parts = cols[i].trim().split('|');
			def.width = parts[1] || false;
			parts = parts[0].split(':');
			def.path = parts[0];
			def.subpath = parts[1];
		}
		if (!utils.isObject(def) || !def.path) {
			throw new Error('List.expandColumns: column definition must contain a path.');
		}
		const col = getCol(def);
		if (col) {
			expanded.push(col);
		}
	}
	if (!nameCol) {
		nameCol = getCol({ path: list.namePath });
		if (nameCol) {
			expanded.unshift(nameCol);
		}
	}
	return expanded;
}
