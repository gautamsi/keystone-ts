/*
TODO: Needs Review and Spec
*/

const moment = require('moment');
const assign = require('object-assign');

export default function (req, res, next) {
	const baby = require('babyparse');
	const keystone = req.keystone;

	const format = req.params.format.split('.')[1]; // json or csv
	const where = {};
	let filters = req.query.filters;
	if (filters && typeof filters === 'string') {
		try { filters = JSON.parse(req.query.filters); }
		catch (e) { /* */ }
	}
	if (typeof filters === 'object') {
		assign(where, req.list.addFiltersToQuery(filters));
	}
	if (req.query.search) {
		assign(where, req.list.addSearchToQuery(req.query.search));
	}
	const query = req.list.model.find(where);
	if (req.query.populate) {
		query.populate(req.query.populate);
	}
	if (req.query.expandRelationshipFields) {
		req.list.relationshipFields.forEach(function (i) {
			query.populate(i.path);
		});
	}
	const sort = req.list.expandSort(req.query.sort);
	query.sort(sort.string);
	query.exec()
	.then(function (results) {
		let data;
		const fields = [];
		if (format === 'csv') {
			data = results.map(function (item) {
				const row = req.list.getCSVData(item, {
					expandRelationshipFields: req.query.expandRelationshipFields,
					fields: req.query.select,
					user: req.user,
				});
				// If nested values in the first item aren't present, babyparse
				// won't add them even if they are present in others. So we
				// add keys from all items to an array and explicitly provided
				// the complete set to baby.unparse() below
				Object.keys(row).forEach(function (i) {
					if (fields.indexOf(i) === -1) fields.push(i);
				});
				return row;
			});
			res.attachment(req.list.path + '-' + moment().format('YYYYMMDD-HHMMSS') + '.csv');
			res.setHeader('Content-Type', 'application/octet-stream');
			const content = baby.unparse({
				data: data,
				fields: fields,
			}, {
				delimiter: keystone.get('csv field delimiter') || ',',
			});
			res.end(content, 'utf-8');
		} else {
			data = results.map(function (item) {
				return req.list.getData(item, req.query.select, req.query.expandRelationshipFields);
			});
			res.json(data);
		}
	})
	.catch(next);
}
