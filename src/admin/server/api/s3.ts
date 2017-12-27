/*
TODO: Needs Review and Spec
*/

export default {

	upload: function (req, res) {
		const knox = require('knox');
		const keystone = req.keystone;
		const Types = keystone.Field.Types;

		if (!keystone.security.csrf.validate(req, req.body.authenticity_token)) {
			return res.status(403).send({ error: { message: 'invalid csrf' } });
		}

		if (req.files && req.files.file) {

			const s3Config = keystone.get('s3 config');

			const file = req.files.file;
			const path = s3Config.s3path ? s3Config.s3path + '/' : '';

			const headers = Types.S3File.prototype.generateHeaders.call({ s3config: s3Config, options: {} }, null, file);

			const s3Client = knox.createClient(s3Config);

			s3Client.putFile(file.path, path + file.name, headers, function (err, s3Response) {
				const sendResult = function () {
					if (err) {
						return res.send({ error: { message: err.message } });
					}

					if (s3Response) {
						if (s3Response.statusCode !== 200) {
							return res.send({ error: { message: 'Amazon returned Http Code: ' + s3Response.statusCode } });
						} else {
							let region = 's3';
							if (s3Config.region && s3Config.region !== 'us-east-1') {
								region = 's3-' + s3Config.region;
							}
							return res.send({ image: { url: 'https://' + region + '.amazonaws.com/' + s3Config.bucket + '/' + file.name } });
						}
					}
				};

				res.format({
					html: sendResult,
					json: sendResult,
				});
			});

		} else {
			res.json({ error: { message: 'No image selected' } });
		}
	},
};
