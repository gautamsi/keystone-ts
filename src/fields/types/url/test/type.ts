const demand = require('must');
const UrlType = require('../UrlType');
const TextType = require('../../text/TextType');

function customFormat (url) {
	return url.toUpperCase();
}

export const initList = function (List) {
	List.add({
		url: UrlType,
		nested: {
			url: UrlType,
		},
		customFormat: { type: UrlType, format: customFormat },
	});
};

export const testFieldType = function (List) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.url.updateItem(testItem, {
				url: 'value',
			}, function () {
				demand(testItem.url).be('value');
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.url'].updateItem(testItem, {
				nested: {
					url: 'value',
				},
			}, function () {
				demand(testItem.nested.url).be('value');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.url'].updateItem(testItem, {
				'nested.url': 'value',
			}, function () {
				demand(testItem.nested.url).be('value');
				done();
			});
		});
	});

	it('should use the common text input validator', function () {
		demand(List.fields.url.validateInput === TextType.prototype.validateInput);
	});

	it('should use the common text required validator', function () {
		demand(List.fields.url.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	it('should use the common text addFilterToQuery method', function () {
		demand(List.fields.url.addFilterToQuery === TextType.prototype.addFilterToQuery);
	});

	describe('format', function () {
		it('should strip the protocol when formatting', function (done) {
			const testItem = new List.model();
			List.fields.url.updateItem(testItem, {
				url: 'http://www.keystonejs.com',
			}, function () {
				demand(testItem._.url.format()).be('www.keystonejs.com');
				done();
			});
		});

		it('should call custom format methods', function (done) {
			const testItem = new List.model();
			List.fields.customFormat.updateItem(testItem, {
				customFormat: 'http://www.keystonejs.com',
			}, function () {
				demand(testItem._.customFormat.format()).be('HTTP://WWW.KEYSTONEJS.COM');
				done();
			});
		});
	});
};
