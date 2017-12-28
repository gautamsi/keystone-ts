/*
TODO: Deprecate.

Has been replaced by the new implementation in list/download, but this version
supports more features at the moment (custom .toCSV method on lists, etc)
*/

import * as _ from 'lodash';
import * as async from 'async';
import * as moment from 'moment';
import { escapeValueForExcel } from '../../../lib/security/escapeValueForExcel';
import * as baby from 'babyparse';

const FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

export function downloadHandler(req, res) {

    const keystone = req.keystone;

    const filters = req.list.processFilters(req.query.q);
    const queryFilters = req.list.getSearchFilters(req.query.search, filters);
    const relFields = [];

    _.forEach(req.list.fields, function (field) {
        if (field.type === 'relationship') {
            relFields.push(field.path);
        }
    });

    const getRowData = function getRowData(i) {

        const rowData = { id: i.id };

        if (req.list.get('autokey')) {
            rowData[req.list.get('autokey').path] = i.get(req.list.get('autokey').path);
        }

        _.forEach(req.list.fields, function (field) {
            if (field.type === 'boolean') {
                rowData[field.path] = i.get(field.path) ? 'true' : 'false';
            } else if (field.type === 'relationship') {
                const refData = i.get(field.path);
                if (field.many) {
                    const values = [];
                    if (Array.isArray(refData) && refData.length) {
                        _.forEach(refData, function (i) {
                            let name = field.refList.getDocumentName(i);
                            if (keystone.get('csv expanded')) {
                                name = '[' + i.id + ',' + name + ']';
                            }
                            values.push(name);
                        });
                    }
                    rowData[field.path] = values.join(', ');
                } else {
                    if (keystone.get('csv expanded')) {
                        rowData[field.path + '_id'] = refData ? refData.id : '';
                        rowData[field.path + '_name'] = refData ? field.refList.getDocumentName(refData) : field.format(i);
                    } else {
                        rowData[field.path] = refData ? field.refList.getDocumentName(refData) : field.format(i);
                    }
                }
            } else {
                rowData[field.path] = field.format(i);
            }
        });

        // Prevent CSV macro injection
        _.forOwn(rowData, (value, prop) => {
            rowData[prop] = escapeValueForExcel(value);
        });

        return rowData;

    };

    const query = req.list.model.find(queryFilters);
    if (relFields) {
        query.populate(relFields.join(' '));
    }
    query.exec(function (err, results) {

        if (err) return res.status(500).json(err);

        const sendCSV = function (data) {

            res.attachment(req.list.path + '-' + moment().format('YYYYMMDD-HHMMSS') + '.csv');
            res.setHeader('Content-Type', 'application/octet-stream');

            const content = baby.unparse(data, {
                delimiter: keystone.get('csv field delimiter') || ',',
            });

            res.end(content, 'utf-8');
        };

        if (!results.length) {
            // fast bail on no results
            return sendCSV([]);
        }
        let data;

        if (results[0].toCSV) {

			/**
			 * Custom toCSV Method present
			 *
			 * Detect dependencies and call it. If the last dependency is `callback`, call it asynchronously.
			 *
			 * Support dependencies are:
			 *   - req (current express request object)
			 *   - user (currently authenticated user)
			 *   - row (default row data, as generated without custom toCSV())
			 *   - callback (invokes async mode, must be provided last)
			 */

            const deps = _.map(results[0].toCSV.toString().match(FN_ARGS)[1].split(','), function (i: string) { return i.trim(); });

            const includeRowData = (deps.indexOf('row') > -1);

            const map = {
                req: req,
                user: req.user,
            };

            const applyDeps = function (fn, _this, _map) {
                const args = _.map(deps, function (key) {
                    return _map[key];
                });
                return fn.apply(_this, args);
            };

            if (_.last(deps) === 'callback') {
                // Allow async toCSV by detecting the last argument is callback
                return async.map(results, function (i: any, callback) {
                    const _map: any = _.clone(map);
                    _map.callback = callback;
                    if (includeRowData) {
                        _map.row = getRowData(i);
                    }
                    applyDeps(i.toCSV, i, _map);
                }, function (err, results) {
                    if (err) {
                        console.log('Error generating CSV for list ' + req.list.key);
                        console.log(err);
                        return res.send(keystone.wrapHTMLError('Error generating CSV', 'Please check the log for more details, or contact support.'));
                    }
                    sendCSV(results);
                });
            } else {
                // Without a callback, toCSV must return the value
                data = [];
                if (includeRowData) {
                    // if row data is required, add it to the map for each iteration
                    _.forEach(results, function (i) {
                        const _map: any = _.clone(map);
                        _map.row = getRowData(i);
                        data.push(applyDeps(i.toCSV, i, _map));
                    });
                } else {
                    // fast path: use the same map for each iteration
                    _.forEach(results, function (i) {
                        data.push(applyDeps(i.toCSV, i, map));
                    });
                }
                return sendCSV(data);
            }

        } else {

			/**
			 * Generic conversion to CSV
			 *
			 * Loops through each of the fields in the List and uses each field's `format` method
			 * to generate the data
			 */

            data = [];
            _.forEach(results, function (i) {
                data.push(getRowData(i));
            });
            return sendCSV(data);
        }

    });

}
