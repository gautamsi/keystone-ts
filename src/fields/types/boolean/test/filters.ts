var demand = require('must');

export const initList = function (List) {
	List.add({
		bool: Boolean,
	});
};

export const getTestItems = function () {
	return [
		{ bool: undefined },
		{ bool: true },
		{ bool: false },
	];
};

export const testFilters = function (List, filter) {
	it('should filter true values', function (done) {
		filter({
			bool: {
				value: 'true',
			},
		}, 'bool', function (results) {
			demand(results).eql([
				true,
			]);
			done();
		});
	});

	it('should filter falsy values', function (done) {
		filter({
			bool: {
				value: 'false',
			},
		}, 'bool', function (results) {
			demand(results).eql([
				false,
				false,
			]);
			done();
		});
	});
};
