const demand = require('must');
const HtmlType = require('../HtmlType');
const TextType = require('../../text/TextType');

export const initList = function (List) {
	List.add({
		html: { type: HtmlType },
		nested: {
			html: { type: HtmlType },
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
			List.fields.html.updateItem(testItem, {
				html: 'foobar',
			}, function () {
				demand(testItem.html).be('foobar');
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.html'].updateItem(testItem, {
				nested: {
					html: 'foobar',
				},
			}, function () {
				demand(testItem.nested.html).be('foobar');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.html'].updateItem(testItem, {
				'nested.html': 'foobar',
			}, function () {
				demand(testItem.nested.html).be('foobar');
				done();
			});
		});
	});

	it('should use the common text input validator', function () {
		demand(List.fields.html.validateInput === TextType.prototype.validateInput);
	});

	it('should use the common text required validator', function () {
		demand(List.fields.html.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	it('should use the common text addFilterToQuery method', function () {
		demand(List.fields.html.addFilterToQuery === TextType.prototype.addFilterToQuery);
	});
};
