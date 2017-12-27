const _ = require('lodash');

export default function populateRelated (rel, callback) {

	const item = this;

	if (typeof callback !== 'function') {
		throw new Error('List.populateRelated(rel, callback) requires a callback function.');
	}

	this.getRelated(rel, function (err, results) {
		_.forEach(results, function (data, key) {
			item[key] = data;
		});
		callback(err, results);
	}, true);

}
