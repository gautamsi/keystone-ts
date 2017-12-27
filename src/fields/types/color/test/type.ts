const demand = require('must');
const ColorType = require('../ColorType');
const TextType = require('../../text/TextType');

export const initList = function (List) {
	List.add({
		color: { type: ColorType },
		nested: {
			color: { type: ColorType },
		},
	});
};

export const createData = function (List) { // eslint-disable-line no-unused-vars

};

export const testFilters = function (List) { // eslint-disable-line no-unused-vars

};

export const testFieldType = function (List) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.color.updateItem(testItem, {
				color: '#ffffff',
			}, function () {
				demand(testItem.color).be('#ffffff');
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.color'].updateItem(testItem, {
				nested: {
					color: '#ffffff',
				},
			}, function () {
				demand(testItem.nested.color).be('#ffffff');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.color'].updateItem(testItem, {
				'nested.color': '#ffffff',
			}, function () {
				demand(testItem.nested.color).be('#ffffff');
				done();
			});
		});
	});

	it('should use the common text input validator', function () {
		demand(List.fields.color.validateInput === TextType.prototype.validateInput);
	});

	it('should use the common text required validator', function () {
		demand(List.fields.color.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	it('should use the common text addFilterToQuery method', function () {
		demand(List.fields.color.addFilterToQuery === TextType.prototype.addFilterToQuery);
	});
};
