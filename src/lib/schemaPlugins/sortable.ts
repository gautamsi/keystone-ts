export function sortable () {

	const list = this;

	this.add({
		sortOrder: { type: Number, index: true, hidden: true },
	});

	this.schema.pre('save', function (next) {

		if (typeof this.sortOrder === 'number') {
			return next();
		}

		const item = this;

		const addLast = function (done) {
			list.model.findOne().sort('-sortOrder').exec(function (err, max) { // eslint-disable-line no-unused-vars, handle-callback-err
				item.sortOrder = (max && max.sortOrder) ? max.sortOrder + 1 : 1;
				done();
			});
		};

		if (list.get('sortable') === 'unshift') {
			list.model.where('sortOrder')
				.setOptions({ multi: true })
				.update(
					{ $inc: { sortOrder: 1 } },
					function (err) {
						if (err) {
							console.log('err', err);
							return addLast(next);
						}
						item.sortOrder = 1;
						next();
					}
				);
		} else {
			addLast(next);
		}
	});

	this.schema.statics.reorderItems = function reorderItems (id, prevOrder, newOrder, cb) {

		prevOrder = parseFloat(prevOrder);
		newOrder = parseFloat(newOrder);

		const whichWay = (newOrder > prevOrder) ? -1 : 1;
		const gte = (newOrder > prevOrder) ? prevOrder + 1 : newOrder;
		const lte = (newOrder > prevOrder) ? newOrder : prevOrder - 1;
		return list.model
			.where('sortOrder')
			.gte(gte)
			.lte(lte)
			.setOptions({ multi: true })
			.update({ $inc: { sortOrder: whichWay } }, function (err) {
				if (err) {
					console.log('err', err);
				}
				list.model.findOneAndUpdate({ _id: id }, { sortOrder: newOrder }).exec(cb);
			});
	};

}
