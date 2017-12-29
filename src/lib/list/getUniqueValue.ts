/**
 * Gets a unique value from a generator method by checking for documents with the same value.
 *
 * To avoid infinite loops when a unique value cannot be found, it will bail and pass back an
 * undefined value after 10 attemptes.
 *
 * WARNING: Because there will always be a small amount of time between checking for an
 * existing value and saving a document, race conditions can occur and it is possible that
 * another document has the 'unique' value assigned at the same time.
 *
 * Because of this, if true uniqueness is required, you should also create a unique index on
 * the database path, and handle duplicate errors thrown on save.
 *
 * @param {String} path to check for uniqueness
 * @param {Function} generator method to call to generate a new value
 * @param {Number} the maximum number of attempts (optional, defaults to 10)
 * @param {Function} callback(err, uniqueValue)
 */
export function getUniqueValue (path, generator, limit, callback) {
	const model = this.model;
	let count = 0;
	let value;
	if (typeof limit === 'function') {
		callback = limit;
		limit = 10;
	}
	if (Array.isArray(generator)) {
		const fn = generator[0];
		const args = generator.slice(1);
		generator = function () {
			return fn.apply(this, args);
		};
	}
	const check = function () {
		if (count++ > 10) {
			return callback(undefined, undefined);
		}
		value = generator();
		model.count().where(path, value).exec(function (err, matches) {
			if (err) return callback(err);
			if (matches) return check();
			callback(undefined, value);
		});
	};
	check();
}
