/*
TODO: Needs Review and Spec
*/

export default {
	upload: function (req, res) {
		const cloudinary = require('cloudinary');
		const keystone = req.keystone;

		if (req.files && req.files.file) {
			const options = {};

			if (keystone.get('wysiwyg cloudinary images filenameAsPublicID')) {
				options.public_id = req.files.file.originalname.substring(0, req.files.file.originalname.lastIndexOf('.'));
			}

			cloudinary.uploader.upload(req.files.file.path, function (result) {
				const sendResult = function () {
					if (result.error) {
						res.send({ error: { message: result.error.message } });
					} else {
						res.send({ image: { url: (keystone.get('cloudinary secure') === true) ? result.secure_url : result.url } });
					}
				};

				// TinyMCE upload plugin uses the iframe transport technique
				// so the response type must be text/html
				res.format({
					html: sendResult,
					json: sendResult,
				});
			}, options);
		} else {
			res.json({ error: { message: 'No image selected' } });
		}
	},
	autocomplete: function (req, res) {
		const cloudinary = require('cloudinary');
		const max = req.query.max || 10;
		const prefix = req.query.prefix || '';
		const next = req.query.next || null;

		cloudinary.api.resources(function (result) {
			if (result.error) {
				res.json({ error: { message: result.error.message } });
			} else {
				res.json({
					next: result.next_cursor,
					items: result.resources,
				});
			}
		}, {
			type: 'upload',
			prefix: prefix,
			max_results: max,
			next_cursor: next,
		});
	},
	get: function (req, res) {
		const cloudinary = require('cloudinary');
		cloudinary.api.resource(req.query.id, function (result) {
			if (result.error) {
				res.json({ error: { message: result.error.message } });
			} else {
				res.json({ item: result });
			}
		});
	},
};
