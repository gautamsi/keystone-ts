import * as async from 'async';

export function countsHandler(req, res) {
    const keystone = req.keystone;
    const counts = {};
    async.each(keystone.lists, function (list: any, next) {
        list.model.count(function (err, count) {
            counts[list.key] = count;
            next(err);
        });
    }, function (err) {
        if (err) return res.apiError('database error', err);
        return res.json({
            counts: counts,
        });
    });
}
