import * as async from 'async';
import * as assign from 'object-assign';
import * as listToArray from 'list-to-array';

export function get(req, res) {
    const where = {};
    let fields = req.query.fields;
    const includeCount = req.query.count !== 'false';
    const includeResults = req.query.results !== 'false';
    if (includeResults && fields) {
        if (fields === 'false') {
            fields = false;
        }
        if (typeof fields === 'string') {
            fields = listToArray(fields);
        }
        if (fields && !Array.isArray(fields)) {
            return res.status(401).json({ error: 'fields must be undefined, a string, or an array' });
        }
    }
    let filters = req.query.filters;
    if (filters && typeof filters === 'string') {
        try { filters = JSON.parse(req.query.filters); }
        catch (e) { } // eslint-disable-line no-empty
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
    if (req.query.expandRelationshipFields && req.query.expandRelationshipFields !== 'false') {
        req.list.relationshipFields.forEach(function (i) {
            query.populate(i.path);
        });
    }
    const sort = req.list.expandSort(req.query.sort);
    async.waterfall([
        function (next) {
            if (!includeCount) {
                return next(null, 0);
            }
            query.count(next);
        },
        function (count, next) {
            if (!includeResults) {
                return next(null, count, []);
            }
            query.find();
            query.limit(Number(req.query.limit) || 100);
            query.skip(Number(req.query.skip) || 0);
            if (sort.string) {
                query.sort(sort.string);
            }
            query.exec(function (err, items) {
                next(err, count, items);
            });
        },
    ], <any>function (err, count, items) {
        if (err) {
            res.logError('admin/server/api/list/get', 'database error finding items', err);
            return res.apiError('database error', err);
        }

        return res.json({
            results: includeResults
                ? items.map(function (item) {
                    return req.list.getData(item, fields, req.query.expandRelationshipFields);
                })
                : undefined,
            count: includeCount
                ? count
                : undefined,
        });
    });
}
