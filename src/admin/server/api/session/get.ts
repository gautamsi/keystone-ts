function get (req, res) {
	return res.json({ user: req.user });
}

export = get;
