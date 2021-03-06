import { validate } from '../../../../lib/security/csrf';
/*
TODO: Needs Review and Spec
*/

import { get as getList } from '../list/get';

export function sortOrder(req, res) {
    const keystone = req.keystone;
    if (!validate(req)) {
        console.log('Refusing to reorder ' + req.list.key + ' ' + req.params.id + '; CSRF failure');
        return res.apiError(403, 'invalid csrf');
    }
    req.list.model.reorderItems(req.params.id, req.params.sortOrder, req.params.newOrder, function (err) {
        if (err) return res.apiError('database error', err);
        return getList(req, res);
    });
}
