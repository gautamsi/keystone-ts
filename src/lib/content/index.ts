const _ = require('lodash');
const keystone = require('../../');
const utils = keystone.utils;

/**
 * Content Class
 *
 * Accessed via `Keystone.content`
 *
 * @api public
 */

const Content = function () {};

/**
 * Loads page content by page key (optional).
 *
 * If page key is not provided, returns a hash of all page contents in the database.
 *
 * ####Example:
 *
 *     keystone.content.fetch('home', function(err, content) { ... });
 *
 * @param {String} key (optional)
 * @param {Function} callback
 * @api public
 */

Content.prototype.fetch = function (page, callback) {

	if (utils.isFunction(page)) {
		callback = page;
		page = null;
	}

	const content = this;

	if (!this.AppContent) {
		return callback({ error: 'invalid page', message: 'No pages have been registered.' });
	}

	if (page) {

		if (!this.pages[page]) {
			return callback({ error: 'invalid page', message: 'The page ' + page + ' does not exist.' });
		}

		this.AppContent.findOne({ key: page }, function (err, result) {

			if (err) return callback(err);

			return callback(null, content.pages[page].populate(result ? result.content.data : {}));

		});

	} else {

		this.AppContent.find(function (err, results) {

			if (err) return callback(err);

			const data = {};

			results.forEach(function (i) {
				if (content.pages[i.key]) {
					data[i.key] = content.pages[i.key].populate(i.content.data);
				}
			});

			_.forEach(content.pages, function (i) {
				if (!data[i.key]) {
					data[i.key] = i.populate();
				}
			});

			return data;

		});

	}

};

/**
 * Sets page content by page key.
 *
 * Merges content with existing content.
 *
 * ####Example:
 *
 *     keystone.content.store('home', { title: 'Welcome' }, function(err) { ... });
 *
 * @param {String} key
 * @param {Object} content
 * @param {Function} callback
 * @api public
 */

Content.prototype.store = function (page, content, callback) {

	if (!this.pages[page]) {
		return callback({ error: 'invalid page', message: 'The page ' + page + ' does not exist.' });
	}

	content = this.pages[page].validate(content);

	// TODO: Handle validation errors

	this.AppContent.findOne({ key: page }, function (err, doc) {

		if (err) return callback(err);

		if (doc) {
			if (doc.content) {
				doc.history.push(doc.content);
			}
			_.defaults(content, doc.content);
		} else {
			doc = new content.AppContent({ key: page });
		}

		doc.content = { data: this.pages[page].clean(content) };
		doc.lastChangeDate = Date.now();

		doc.save(callback);

	});

};

/**
 * Registers a page. Should not be called directly, use Page.register() instead.
 *
 * @param {Page} page
 * @api private
 */

Content.prototype.page = function (key, page) {

	if (!this.pages) {
		this.pages = {};
	}

	if (arguments.length === 1) {

		if (!this.pages[key]) {
			throw new Error('keystone.content.page() Error: page ' + key + ' cannot be registered more than once.');
		}

		return this.pages[key];

	}

	this.initModel();

	if (this.pages[key]) {
		throw new Error('keystone.content.page() Error: page ' + key + ' cannot be registered more than once.');
	}

	this.pages[key] = page;

	return page;

};

/**
 * Ensures the Mongoose model for storing content is initialised.
 *
 * Called automatically when pages are added.
 *
 * @api private
 */

Content.prototype.initModel = function () {

	if (this.AppContent) return;

	const contentSchemaDef = {
		createdAt: { type: Date, default: Date.now },
		data: { type: keystone.mongoose.Schema.Types.Mixed },
	};

	const ContentSchema = new keystone.mongoose.Schema(contentSchemaDef);

	const PageSchema = new keystone.mongoose.Schema({
		page: { type: String, index: true },
		lastChangeDate: { type: Date, index: true },
		content: contentSchemaDef,
		history: [ContentSchema],
	}, { collection: 'app_content' });

	this.AppContent = keystone.mongoose.model('App_Content', PageSchema);

};

/**
 * Outputs client-side editable data for content management
 *
 * Called automatically when pages are added.
 *
 * @api private
 */

Content.prototype.editable = function (user, options) {

	if (!user || !user.canAccessKeystone) {
		return undefined;
	}

	if (options.list) {

		const list = keystone.list(options.list);

		if (!list) {
			return JSON.stringify({ type: 'error', err: 'list not found' });
		}

		const data = {
			type: 'list',
			path: list.getAdminURL(),
			singular: list.singular,
			plural: list.plural,
		};

		if (options.id) {
			data.id = options.id;
		}

		return JSON.stringify(data);

	}

};


/**
 * The exports object is an instance of Content.
 *
 * @api public
 */

export default new Content();

// Expose Classes
export const Page = require('./page');
export const Types = require('./types');
