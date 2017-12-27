/**
 * Generate page array for pagination
 *
 * @param {Number} the maximum number pages to display in the pagination
 * @param {Object} page options
 */
function getPages (options, maxPages) {
	const surround = Math.floor(maxPages / 2);
	let firstPage = maxPages ? Math.max(1, options.currentPage - surround) : 1;
	const padRight = Math.max(((options.currentPage - surround) - 1) * -1, 0);
	const lastPage = maxPages ? Math.min(options.totalPages, options.currentPage + surround + padRight) : options.totalPages;
	const padLeft = Math.max(((options.currentPage + surround) - lastPage), 0);
	options.pages = [];
	firstPage = Math.max(Math.min(firstPage, firstPage - padLeft), 1);
	for (let i = firstPage; i <= lastPage; i++) {
		options.pages.push(i);
	}
	if (firstPage !== 1) {
		options.pages.shift();
		options.pages.unshift('...');
	}
	if (lastPage !== Number(options.totalPages)) {
		options.pages.pop();
		options.pages.push('...');
	}
}

export default getPages;
