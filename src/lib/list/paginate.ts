/**
 * Gets a special Query object that will paginate documents in the list
 *
 * Example:
 *     list.paginate({
 *         page: 1,
 *         perPage: 100,
 *         maxPages: 10
 *     }).exec(function(err, results) {
 *         // do something
 *     });
 *
 * @param {Object} options
 * @param {Function} callback (optional)
 */
function paginate (options, callback) {
	const list = this;
	const model = this.model;

	options = options || {};

	const query = model.find(options.filters, options.optionalExpression);
	const countQuery = model.find(options.filters);

	query._original_exec = query.exec;
	query._original_sort = query.sort;
	query._original_select = query.select;

	const currentPage = Number(options.page) || 1;
	const resultsPerPage = Number(options.perPage) || 50;
	const maxPages = Number(options.maxPages) || 10;
	const skip = (currentPage - 1) * resultsPerPage;

	list.pagination = { maxPages: maxPages };

	// as of mongoose 3.7.x, we need to defer sorting and field selection
	// until after the count has been executed

	query.select = function () {
		options.select = arguments[0];
		return query;
	};

	query.sort = function () {
		options.sort = arguments[0];
		return query;
	};

	query.exec = function (callback) {
		countQuery.count(function (err, count) {
			if (err) callback(err);

			query.find().limit(resultsPerPage).skip(skip);

			// apply the select and sort options before calling exec
			if (options.select) {
				query._original_select(options.select);
			}

			if (options.sort) {
				query._original_sort(options.sort);
			}

			query._original_exec(function (err, results) {
				if (err) return callback(err);
				const totalPages = Math.ceil(count / resultsPerPage);
				const rtn = {
					total: count,
					results: results,
					currentPage: currentPage,
					totalPages: totalPages,
					pages: [],
					previous: (currentPage > 1) ? (currentPage - 1) : false,
					next: (currentPage < totalPages) ? (currentPage + 1) : false,
					first: skip + 1,
					last: skip + results.length,
				};
				list.getPages(rtn, maxPages);
				callback(err, rtn);
			});
		});

	};

	if (callback) {
		return query(callback);
	} else {
		return query;
	}
}

export = paginate;
