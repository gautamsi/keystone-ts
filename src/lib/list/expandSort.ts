const listToArray = require('list-to-array');

function truthy (i) { return i; }

export function expandSort (input) {
	const fields = this.fields;
	const sort: any = {
		rawInput: input || this.defaultSort,
		isDefaultSort: false,
	};
	sort.input = sort.rawInput;
	if (sort.input === '__default__') {
		sort.isDefaultSort = true;
		sort.input = this.sortable ? 'sortOrder' : this.namePath;
	}
	sort.paths = listToArray(sort.input).map(function (path) {
		let invert = false;
		if (path.charAt(0) === '-') {
			invert = true;
			path = path.substr(1);
		}
		const field = fields[path];
		if (!field) {
			return;
		}
		return {
			field: field,
			invert: invert,
			path: field.path,
		};
	}).filter(truthy);
	sort.string = sort.paths.map(function (i) {
		if (i.field.getSortString) {
			return i.field.getSortString(i);
		}
		return i.invert ? '-' + i.path : i.path;
	}).join(' ');
	return sort;
}
