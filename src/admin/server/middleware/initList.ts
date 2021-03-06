export function initListMiddleware (req, res, next) {
	const keystone = req.keystone;
	req.list = keystone.list(req.params.list);
	if (!req.list) {
		if (req.headers.accept === 'application/json') {
			return res.status(404).json({ error: 'invalid list path' });
		}
		req.flash('error', 'List ' + req.params.list + ' could not be found.');
		return res.redirect('/' + keystone.get('admin path'));
	}
	next();
}
