const _ = require('lodash');

export default function transform (doc, ret) {
	if (doc._populatedRelationships) {
		_.forEach(doc._populatedRelationships, function (on, key) {
			if (!on) return;
			ret[key] = doc[key];
		});
	}
}
