let fieldTests = require('./commonFieldTestUtils');
let ModelTestConfig = require('../../../modelTestConfig/TextareaModelTestConfig');

export = {
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'Textarea field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Textarea' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
				{ name: 'fieldA', }
			],
		});

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Textarea field can be filled via the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Textarea' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Textarea Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'Some test text for field A' }, },
			],
		});
		browser.adminUIInitialFormScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Textarea Field Test 1' }, },
				// FIXME: webteckie Jan 13, 2017 -- For some reason this doesn't work in SauceLabs
				// { name: 'fieldA', input: { value: 'Some test text for field A' }, },
			],
		});

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Textarea field should show correctly in the edit form': function (browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'fieldA', },
				{ name: 'fieldB', }
			],
		});

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Textarea Field Test 1' }, },
				// FIXME: webteckie Jan 13, 2017 -- For some reason this doesn't work in SauceLabs
				// { name: 'fieldA', input: { value: 'Some test text for field A' }, },
			],
		});
	},
	'Textarea field can be filled via the edit form': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldB', input: { value: 'Some test text for field B' }, },
			],
		});

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Textarea Field Test 1' }, },
				// FIXME: webteckie Jan 13, 2017 -- For some reason this doesn't work in SauceLabs
				// { name: 'fieldA', input: { value: 'Some test text for field A' }, },
				// { name: 'fieldB', input: { value: 'Some test text for field B' }, },
			],
		});
	},
};
