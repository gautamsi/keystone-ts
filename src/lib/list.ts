import { Keystone } from '../../src/keystone';
import { Schema } from 'mongoose';
import * as _debug from 'debug';
import * as listToArray from 'list-to-array';

import * as _ from 'lodash';
import * as utils from 'keystone-utils';
import { FieldTypeBase } from '../fields/types/FieldTypeBase';
import { FieldTypes } from '../fields/types';
import { escapeValueForExcel } from './security/escapeValueForExcel';
import * as queryfilterlib from 'queryfilter';
import * as async from 'async';
import * as moment from 'moment';
import { evalDependsOn } from '../fields/utils/evalDependsOn';

import * as schemaPlugins from './schemaPlugins';
import { UpdateHandler } from './updateHandler';


export class List<T> {
    tracking: any;
    pagination: { maxPages: number; };
    sortable: any;
    autokey: any;
    static keystone: Keystone;
    _initialFields: any;
    model: any;
    fieldTypes: { wysiwyg?: any };
    relationshipFields: any[];
    relationships: {};
    mappings: { name: any; createdBy: any; createdOn: any; modifiedBy: any; modifiedOn: any; };
    fieldsArray: any[];
    fields: {};
    underscoreMethods: {};
    uiElements: any[];
    schemaFields: any[];
    schema: Schema;
    path: any;
    key: any;
    options: any;
    _defaultColumns: any;
    _searchFields: any;



    // define property getters

    get label(): any {
        return this.get('label') || this.set('label', utils.plural(utils.keyToLabel(this.key)));
    }

    get singular(): any {
        return this.get('singular') || this.set('singular', utils.singular(this.label));
    }

    get plural(): any {
        return this.get('plural') || this.set('plural', utils.plural(this.singular));
    }

    get namePath(): any {
        return this.mappings.name || '_id';
    }

    get nameField(): any {
        return this.fields[this.mappings.name];
    }

    get nameIsVirtual(): any {
        return this.model.schema.virtuals[this.mappings.name] ? true : false;
    }

    get nameFieldIsFormHeader(): any {
        return (this.fields[this.mappings.name] && this.fields[this.mappings.name].type === 'text') ? !this.fields[this.mappings.name].noedit : false;
    }

    get nameIsInitial(): any {
        return (this.fields[this.mappings.name] && this.fields[this.mappings.name].options.initial === undefined);
    }

    get initialFields(): any {
        return this._initialFields || (this._initialFields = _.filter(this.fields, function (i) { return i.initial; }));
    }

    // TODO: Protect dynamic properties from being accessed until the List
    // has been registered (otherwise, incomplete schema could be cached)

    // Search Fields

    get searchFields(): any {
        if (!this._searchFields) {
            this._searchFields = this.expandPaths(this.get('searchFields'));
        }
        return this._searchFields;
    }
    set searchFields(value) {
        this.set('searchFields', value);
        delete this._searchFields;
    }


    // Default Sort Field

    get defaultSort(): any {
        const ds = this.get('defaultSort');
        return (ds === '__default__') ? (this.get('sortable') ? 'sortOrder' : this.namePath) : ds;
    }
    set defaultSort(value) {
        this.set('defaultSort', value);
    }
    // Default Column Fields

    get defaultColumns(): any {
        if (!this._defaultColumns) {
            this._defaultColumns = this.expandColumns(this.get('defaultColumns'));
        }
        return this._defaultColumns;
    }
    set defaultColumns(value) {
        this.set('defaultColumns', value);
        delete this._defaultColumns;
    }



    constructor(key, options) {
        // if (!(this instanceof List)) return new List(key, options);

        let defaultOptions = {
            schema: {
                collection: List.keystone.prefixModel(key),
            },
            noedit: false,
            nocreate: false,
            nodelete: false,
            autocreate: false,
            sortable: false,
            hidden: false,
            track: false,
            inherits: false,
            perPage: 100,
            searchFields: '__name__',
            searchUsesTextIndex: false,
            defaultSort: '__default__',
            defaultColumns: '__name__',
        };

        // initialFields values are initialised on demand by the getter
        let initialFields;

        // Inherit default options from parent list if it exists
        if (options && options.inherits) {
            if (options.inherits.options && options.inherits.options.inherits) {
                throw new Error('Inherited Lists may not contain any inheritance');
            }
            defaultOptions = utils.options(defaultOptions, options.inherits.options);
            if (options.inherits.options.track) {
                options.track = false;
            }
        }

        this.options = utils.options(defaultOptions, options);

        // init properties
        this.key = key;
        this.path = this.get('path') || utils.keyToPath(key, true);
        this.schema = new Schema({}, this.options.schema);
        this.schemaFields = [];
        this.uiElements = [];
        this.underscoreMethods = {};
        this.fields = {};
        this.fieldsArray = [];
        this.fieldTypes = {};
        this.relationshipFields = [];
        this.relationships = {};
        this.mappings = {
            name: null,
            createdBy: null,
            createdOn: null,
            modifiedBy: null,
            modifiedOn: null,
        };

        const self = this;

        // init mappings
        _.forEach(this.options.map, function (val, key) { self.map(key, val); });


        if (this.get('inherits')) {
            const parentFields = this.get('inherits').schemaFields;
            this.add.apply(this, parentFields);
        }
    }

    static init(keystone: Keystone): typeof List {
        List.keystone = keystone;
        return List;
    }

    // Add prototype methods

    /**
     * Adds one or more fields to the List
     * Based on Mongoose's Schema.add
     */
    add(...listargs: any[]): List<T> {
        // add(key: keyof T, field: FieldTypeBase, prefix: string = ''): List<T> {

        const add = (obj, prefix?) => {
            prefix = prefix || '';
            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length; ++i) {
                const key = keys[i];
                if (!obj[key]) {
                    throw new Error(
                        'Invalid value for schema path `' + prefix + key + '` in `' + this.key + '`.\n'
                        + 'Did you misspell the field type?\n'
                    );
                }
                if (utils.isObject(obj[key]) && (!obj[key].constructor || obj[key].constructor.name === 'Object') && (!obj[key].type || obj[key].type.type)) {
                    if (Object.keys(obj[key]).length) {
                        // nested object, e.g. { last: { name: String }}
                        // matches logic in mongoose/Schema:add
                        this.schema.nested[prefix + key] = true;
                        add(obj[key], prefix + key + '.');
                    } else {
                        addField(prefix + key, obj[key]); // mixed type field
                    }
                } else {
                    addField(prefix + key, obj[key]);
                }
            }
        };

        const addField = (path, options) => {
            if (this.isReserved(path)) {
                throw new Error('Path ' + path + ' on list ' + this.key + ' is a reserved path');
            }
            this.uiElements.push({
                type: 'field',
                field: this.field(path, options),
            });
        };

        const args = Array.prototype.slice.call(arguments);

        _.forEach(args, (def) => {
            this.schemaFields.push(def);
            if (typeof def === 'string') {
                if (def === '>>>') {
                    this.uiElements.push({
                        type: 'indent',
                    });
                } else if (def === '<<<') {
                    this.uiElements.push({
                        type: 'outdent',
                    });
                } else {
                    this.uiElements.push({
                        type: 'heading',
                        heading: def,
                        options: {},
                    });
                }
            } else {
                if (def.heading && typeof def.heading === 'string') {
                    this.uiElements.push({
                        type: 'heading',
                        heading: def.heading,
                        options: def,
                    });
                } else {
                    add(def);
                }
            }
        });

        return this;
    }
    addFiltersToQuery(filters) {
        const debug = _debug('keystone:core:list:addFiltersToQuery');
        const fields = Object.keys(this.fields);
        const query = {};
        fields.forEach(function (path) {
            const field = this.fields[path];
            if (!field.addFilterToQuery || !filters[field.path]) return;
            combineQueries(query, field.addFilterToQuery(filters[field.path]));
        }, this);

        debug('Adding filters to query, returned:', query);
        return query;
    }
    addSearchToQuery(searchString) {
        const debug = _debug('keystone:core:list:addSearchToQuery');
        searchString = String(searchString || '').trim();
        const query: any = {};
        let searchFilters = [];
        if (!searchString) return query;

        if (this.options.searchUsesTextIndex) {
            debug('Using text search index for value: "' + searchString + '"');
            searchFilters.push({
                $text: {
                    $search: searchString,
                },
            });

            if (this.autokey) {
                const strictAutokeyFilter = {};
                const autokeyRegExp = new RegExp('^' + utils.escapeRegExp(searchString));
                strictAutokeyFilter[this.autokey.path] = autokeyRegExp;
                searchFilters.push(strictAutokeyFilter);
            }
        } else {
            debug('Using regular expression search for value: "' + searchString + '"');
            const searchRegExp = new RegExp(utils.escapeRegExp(searchString), 'i');
            searchFilters = this.searchFields.map(function (i) {
                if (i.field && i.field.type === 'name') {
                    return getNameFilter(i.field, searchString);
                } else {
                    return getStringFilter(i.path, searchRegExp);
                }
            }, this);

            if (this.autokey) {
                const autokeyFilter = {};
                autokeyFilter[this.autokey.path] = searchRegExp;
                searchFilters.push(autokeyFilter);
            }
        }

        if (utils.isValidObjectId(searchString)) {
            searchFilters.push({
                _id: searchString,
            });
        }

        if (searchFilters.length > 1) {
            query.$or = searchFilters;
        } else if (searchFilters.length) {
            Object.assign(query, searchFilters[0]);
        }

        debug('Built search query for value: "' + searchString + '"', query);
        return query;
    }

    /**
     * # List.apiForGet(options)
     *
     * Returns JSON API middleware for a GET /:id endpoint
     *
     * Supports the following options:
     *
     * ### `id` (string)
     *
     * Optional; Defaults to `"id"`
     *
     * The name of the express url param that contains the ID to get.
     *
     * ### `query` `function(query, req, res)`
     *
     * Optional
     *
     * A function that modifies the query to find the item. You can
     * use this to check anything about the request (e.g. permissions), and/or modify
     * the conditions on the mongoose query.
     *
     * You can handle the response from within this function; return `false` to stop
     * the API middleware from continuing.
     *
     * ### `query` `object`
     *
     * Optional
     *
     * An object of additional `where` conditions to add to the `query`
     *
     * ### `transform` `function(item, req, res)`
     *
     * A function that transforms the object before it is sent as JSON.
     */

    apiForGet(options) {
        const idParam = options.id || 'id';
        return (req, res) => {
            const id = req.params[idParam];
            const query = this.model.findById(id);
            if (typeof options.query === 'function') {
                const result = options.query(query, req);
                if (result === false) return;
            } else if (typeof options.query === 'object') {
                query.where(options.query);
            }
            query.exec(function (err, item) {
                if (err) return res.status(500).json({ err: 'database error', detail: err });
                if (!item) return res.status(404).json({ err: 'not found', id: id });
                if (options.transform) {
                    item = options.transform(item, req, res);
                    if (item === false) return;
                }
                return res.json({
                    data: item,
                });
            });
        };
    }

    /**
     * Checks to see if a field path matches a currently unmapped path, and
     * if so, adds a mapping for it.
     */
    automap(field) {
        if ((field.path in this.mappings) && !this.mappings[field.path]) {
            this.map(field.path, field.path);
        }
        return this;
    }

    /**
     * Returns either false if the list has no search fields defined or a structure
     * describing the text index that should exist.
     */
    buildSearchTextIndex() {
        const idxDef = {};

        for (let i = 0; i < this.searchFields.length; i++) {
            const sf = this.searchFields[i];
            if (!sf.path || !sf.field) continue;

            // TODO: Allow fields to define their own `getTextIndex` method, so that
            // each type can define the right options for their schema. This is unlikely
            // to behave as expected for fields that aren't simple strings or names
            // until that has been done. Should error if the field type doesn't support
            // text indexing, as the list has been misconfigured.

            // Does the field have a single path or does it use nested values (like 'name')
            if (sf.field.paths) {
                const nFields = sf.field.paths;
                const nKeys = Object.keys(nFields);
                for (let n = 0; n < nKeys.length; n++) {
                    idxDef[nFields[nKeys[n]]] = 'text';
                }
            }
            else if (sf.field.path) {
                idxDef[sf.field.path] = 'text';
            }
        }

        // debug('text index for \'' + this.key + '\':', idxDef);
        return Object.keys(idxDef).length > 0 ? idxDef : false;
    }

    /**
     * Look for a text index defined in the current list schema; returns boolean
     * Note this doesn't check for text indexes that exist in the DB
     */

    declaresTextIndex() {
        const indexes = this.schema.indexes();

        for (let i = 0; i < indexes.length; i++) {
            const fields = indexes[i][0];
            const fieldNames = Object.keys(fields);

            for (let h = 0; h < fieldNames.length; h++) {
                const val = fields[fieldNames[h]];
                if (typeof val === 'string' && val.toLowerCase() === 'text') return true;
            }
        }
        return false;
    }

    /**
     * Does what it can to ensure the collection has an appropriate text index.
     *
     * Works around unreliable behaviour with the Mongo drivers ensureIndex()
     * Specifically, when the following are true..
     *   - Relying on collection.ensureIndexes() to create text indexes
     *   - A text index already exists on the collection
     *   - The existing index has a different definition but the same name
     * The index is not created/updated and no error is returned, either by the
     * ensureIndexes() call or the connection error listener.
     * Or at least that's what was happening for me (mongoose v3.8.40, mongodb v1.4.38)..
     */
    ensureTextIndex(callback) {
        const debug = _debug('keystone:core:list:ensureTextIndex');
        const collection = this.model.collection;

        const textIndex = this.buildSearchTextIndex();
        const fieldsHash = Math.abs(hashString(Object.keys(textIndex).sort().join(';')));
        const indexNamePrefix = 'keystone_searchFields_textIndex_';
        const newIndexName = indexNamePrefix + fieldsHash;

        // We use this later to create a new index if needed
        const createNewIndex = () => {
            collection.createIndex(textIndex, { name: newIndexName }, (result) => {
                debug("collection.createIndex() result for '" + this.key + '\:', result);
                return callback();
            });
        };

        collection.getIndexes((err, indexes) => {
            if (err) {
                if (err.code === 26) {
                    // if the database doesn't exist, we'll get error code 26 "no database" here
                    // that's fine, we just default the indexes object so the new text index
                    // gets created when the database is connected.
                    indexes = {};
                } else {
                    // otherwise, we've had an unexpected error, so we throw it
                    throw err;
                }
            }
            const indexNames = Object.keys(indexes);

            // Search though the
            for (let i = 0; i < indexNames.length; i++) {
                const existingIndexName = indexNames[i];
                let isText = false;

                // Check we're dealing with a text index
                for (let h = 0; h < indexes[existingIndexName].length; h++) {
                    const column = indexes[existingIndexName][h];
                    if (column[1] === 'text') isText = isText || true;
                }

                // Skip non-text indexes
                if (!isText) continue;

                // Already exists with correct def
                if (existingIndexName === newIndexName) {
                    debug("Existing text index '" + existingIndexName + "' already matches the searchFields for '" + this.key + "'");
                    return;
                }

                // Exists but hash (def) doesn't match
                // Check for 'searchFields_text_index' for backwards compatibility
                if (existingIndexName.slice(0, indexNamePrefix.length) === indexNamePrefix || existingIndexName === 'searchFields_text_index') {
                    debug("Existing text index '" + existingIndexName + "' doesn't match the searchFields for '" + this.key + "' and will be recreated as '" + newIndexName + "'");

                    collection.dropIndex(existingIndexName, (result) => {
                        debug("collection.dropIndex() result for '" + this.key + '\:', result);
                        createNewIndex();
                    });
                    return;
                }

                // It's a text index but not one of ours; nothing we can do
                console.error(''
                    + "list.ensureTextIndex() failed to update the existing text index '" + existingIndexName + "' for the '" + this.key + "' list.\n"
                    + "The existing index wasn't automatically created by ensureTextIndex() so will not be replaced.\n"
                    + 'This may lead to unexpected behaviour when performing text searches on the this list.'
                );
                return;
            }

            // No text indexes found at all; create ours now
            debug("No existing text index found in '" + this.key + "'; Creating ours now");
            createNewIndex();
        });
    }

    /**
     * Expands a comma-separated string or array of columns into valid column objects.
     *
     * Columns can be:
     *    - A Field, in the format "field|width"
     *    - A Field in a single related List, in the format "list:field|width"
     *    - Any valid path in the Schema, in the format "path|width"
     *
     * The width part is optional, and can be in the format "n%" or "npx".
     *
     * The path __name__ is automatically mapped to the namePath of the List.
     *
     * The field or path for the name of the item (defaults to ID if not set or detected)
     * is automatically prepended if not explicitly included.
     */
    expandColumns(cols) {
        if (typeof cols === 'string') {
            cols = cols.split(',');
        }
        if (!Array.isArray(cols)) {
            throw new Error('List.expandColumns: cols must be an array.');
        }
        const list = this;
        const expanded = [];
        let nameCol = false;
        const getCol = function (def) {
            if (def.path === '__name__') {
                def.path = list.namePath;
            }
            const field = list.fields[def.path];
            let col = null;
            if (field) {
                col = {
                    field: field,
                    path: field.path,
                    type: field.type,
                    label: def.label || field.label,
                };
                if (col.type === 'relationship') {
                    col.refList = col.field.refList;
                    if (col.refList) {
                        col.refPath = def.subpath || col.refList.namePath;
                        col.subField = col.refList.fields[col.refPath];
                        col.populate = { path: col.field.path, subpath: col.refPath };
                    }
                    if (!def.label && def.subpath) {
                        col.label = field.label + ': ' + (col.subField ? col.subField.label : utils.keyToLabel(def.subpath));
                    }
                }
            } else if (list.model.schema.paths[def.path] || list.model.schema.virtuals[def.path]) {
                // column refers to a path in the schema
                // TODO: this needs to handle sophisticated types, including arrays, nested Schemas, and mixed types
                col = {
                    path: def.path,
                    label: def.label || utils.keyToLabel(def.path),
                };
            }
            if (col) {
                col.width = def.width;
                if (col.path === list.namePath) {
                    col.isName = true;
                    nameCol = col;
                }
                if (field && field.col) {
                    _.extend(col, field.col);
                }
            }
            return col;
        };
        for (let i = 0; i < cols.length; i++) {
            const def: any = {};
            if (typeof cols[i] === 'string') {
                let parts = cols[i].trim().split('|');
                def.width = parts[1] || false;
                parts = parts[0].split(':');
                def.path = parts[0];
                def.subpath = parts[1];
            }
            if (!utils.isObject(def) || !def.path) {
                throw new Error('List.expandColumns: column definition must contain a path.');
            }
            const col = getCol(def);
            if (col) {
                expanded.push(col);
            }
        }
        if (!nameCol) {
            nameCol = getCol({ path: list.namePath });
            if (nameCol) {
                expanded.unshift(nameCol);
            }
        }
        return expanded;
    }

    expandPaths(paths) {
        return listToArray(paths).map(function (path) {
            if (path === '__name__') {
                path = this.mappings.name;
            }
            return {
                path: path,
                field: this.fields[path],
            };
        }, this);
    }

    expandSort(input) {
        const fields = this.fields;
        const sort: any = {
            rawInput: input || this.defaultSort,
            isDefaultSort: false,
        };
        sort.input = sort.rawInput;
        if (sort.input === '__default__') {
            sort.isDefaultSort = true;
            sort.input = this.sortable ? 'sortOrder' : this.namePath;
        }
        sort.paths = listToArray(sort.input).map(function (path) {
            let invert = false;
            if (path.charAt(0) === '-') {
                invert = true;
                path = path.substr(1);
            }
            const field = fields[path];
            if (!field) {
                return;
            }
            return {
                field: field,
                invert: invert,
                path: field.path,
            };
        }).filter(truthy);
        sort.string = sort.paths.map(function (i) {
            if (i.field.getSortString) {
                return i.field.getSortString(i);
            }
            return i.invert ? '-' + i.path : i.path;
        }).join(' ');
        return sort;
    }

    /**
     * Creates a new field at the specified path, with the provided options.
     * If no options are provides, returns the field at the specified path.
     */
    field(path, options) {
        if (arguments.length === 1) {
            return this.fields[path];
        }
        if (typeof options === 'function') {
            options = { type: options };
        }
        if (this.get('noedit')) {
            options.noedit = true;
        }
        if (!options.note && this.get('notes')) {
            options.note = this.get('notes')[path];
        }
        if (typeof options.type !== 'function') {
            throw new Error('Fields must be specified with a type function');
        }
        if (!(options.type.prototype instanceof FieldTypeBase)) {
            // Convert native field types to their default Keystone counterpart
            if (options.type === String) {
                options.type = FieldTypes.Text;
            } else if (options.type === Number) {
                options.type = FieldTypes.Number;
            } else if (options.type === Boolean) {
                options.type = FieldTypes.Boolean;
            } else if (options.type === Date) {
                options.type = FieldTypes.Datetime;
            } else {
                throw new Error('Unrecognised field constructor: ' + options.type);
            }
        }

        // Note the presence of this field type for client-side script optimisation
        this.fieldTypes[options.type.name] = options.type.properName;

        // Wysiwyg HTML fields are handled as a special case so we can include TinyMCE as required
        if (options.type.name === 'HtmlType' && options.wysiwyg) {
            this.fieldTypes.wysiwyg = true;
        }

        const field = new options.type(this, path, options);
        this.fields[path] = field;
        this.fieldsArray.push(field);
        if (field.type === 'Relationship') {
            this.relationshipFields.push(field);
        }
        return field;
    }

    get(key) {
        return this.set(key);
    }

    /**
     * Gets the Admin URL to view the list (or an item if provided)
     *
     * Example:
     *     var listURL = list.getAdminURL()
     *     var itemURL = list.getAdminURL(item)
     *
     * @param {Object} item
     */
    getAdminURL(item) {
        return '/' + List.keystone.get('admin path') + '/' + this.path + (item ? '/' + item.id : '');
    }

    /**
     * Gets the data from an Item ready to be serialised to CSV for download
     */

    getCSVData(item, options) {
        if (!options) {
            options = {};
        }
        options.fields;
        if (options.fields === undefined) {
            options.fields = Object.keys(this.options.fields);
        }
        const data = {
            id: String(item.id),
        };
        if (this.autokey) {
            data[this.autokey.path] = item.get(this.autokey.path);
        }
        if (options.fields) {
            if (typeof options.fields === 'string') {
                options.fields = listToArray(options.fields);
            }
            if (!Array.isArray(options.fields)) {
                throw new Error('List.getCSV: options.fields must be undefined, a string, or an array.');
            }
            options.fields.forEach((path) => {
                const field = this.fields[path];
                if (!field) {
                    // if the path isn't actually a field, just add the value from
                    // that path in the mongoose document.
                    data[path] = item.get(path);
                    return;
                }
                if (field.type !== 'relationship' || !options.expandRelationshipFields) {
                    // use the transformFieldValue function to get the data
                    data[path] = transformFieldValue(field, item, options);
                    return;
                }
                // relationship values should be expanded into separate name and
                // id pairs using the field's getExpandedData method.
                const expanded = field.getExpandedData(item);
                if (field.many) {
                    // for many-type relationships, ensure the value is an array,
                    // and turn it into a list of 'name (id)' values
                    data[path] = (Array.isArray(expanded) ? expanded : []).map(function (i) {
                        return i.name ? i.name + ' (' + i.id + ')' : i.id;
                    }).join(', ');
                } else if (typeof expanded === 'object') {
                    // for single-type relationships, add two columns to the data
                    data[path] = expanded.name;
                    data[path + 'Id'] = expanded.id;
                }
            }, this);
        }
        if (typeof item.getCSVData === 'function') {
            const ext = item.getCSVData(data, options);
            if (typeof ext === 'object') {
                _.forOwn(ext, function (value, key) {
                    if (value === undefined) {
                        delete data[key];
                    } else {
                        data[key] = value;
                    }
                });
            }
        }
        // Copy each value into the return structure, flattening arrays into lists and
        // flattening objects into a column per property (one level only)
        const rtn = {};
        _.forOwn(data, (value, prop) => {
            if (Array.isArray(value)) {
                // Array values are serialised to JSON, this should be an edge-case catch
                // for data coming raw from the item; array-type fields will already have
                // been stringified by the field.format method.
                rtn[prop] = JSON.stringify(value);
            } else if (typeof value === 'object') {
                // For object values, we loop through each key and add it to its own column
                // in the csv. Complex values are serialised to JSON.
                _.forOwn(value, function (v, i) {
                    const suffix = i.substr(0, 1).toUpperCase() + i.substr(1);
                    rtn[prop + suffix] = (typeof v === 'object') ? JSON.stringify(v) : v;
                });
            } else {
                rtn[prop] = value;
            }
        });

        // Prevent CSV macro injection
        _.forOwn(rtn, (value, prop) => {
            rtn[prop] = escapeValueForExcel(value);
        });

        return rtn;
    }

    /**
     * Gets the data from an Item ready to be serialised for client-side use, as
     * used by the React components and the Admin API
     */

    getData(item, fields, expandRelationshipFields) {
        const data: any = {
            id: item.id,
            name: this.getDocumentName(item),
        };
        if (this.autokey) {
            data[this.autokey.path] = item.get(this.autokey.path);
        }
        if (this.options.sortable) {
            data.sortOrder = item.sortOrder;
        }
        if (fields === undefined) {
            fields = Object.keys(this.fields);
        }
        if (fields) {
            if (typeof fields === 'string') {
                fields = listToArray(fields);
            }
            if (!Array.isArray(fields)) {
                throw new Error('List.getData: fields must be undefined, a string, or an array.');
            }
            data.fields = {};
            fields.forEach(function (path) {
                const field = this.fields[path];
                if (field) {
                    if (field.type === 'Relationship' && expandRelationshipFields) {
                        data.fields[path] = field.getExpandedData(item);
                    } else {
                        data.fields[path] = field.getData(item);
                    }
                } else {
                    data.fields[path] = item.get(path);
                }
            }, this);
        }
        return data;
    }

    /**
     * Gets the name of the provided document from the correct path
     *
     * Example:
     *     var name = list.getDocumentName(item)
     *
     * @param {Object} item
     * @param {Boolean} escape - causes HTML entities to be encoded
     */
    getDocumentName(doc, escape?) {
        // console.log('getting document name for ' + doc.id, 'nameField: ' + this.nameField, 'namePath: ' + this.namePath);
        // console.log('raw name value: ', doc.get(this.namePath));
        // if (this.nameField) console.log('formatted name value: ', this.nameField.format(doc));
        const name = String(this.nameField ? this.nameField.format(doc) : doc.get(this.namePath));
        return (escape) ? utils.encodeHTMLEntities(name) : name;
    }

    /**
     * Gets the options for the List, as used by the React components
     */
    getOptions() {
        const ops = {
            autocreate: this.options.autocreate,
            autokey: this.autokey,
            defaultColumns: this.options.defaultColumns,
            defaultSort: this.options.defaultSort,
            fields: {},
            hidden: this.options.hidden,
            initialFields: _.map(this.initialFields, 'path'),
            key: this.key,
            label: this.label,
            nameField: this.nameField ? this.nameField.getOptions() : null,
            nameFieldIsFormHeader: this.nameFieldIsFormHeader,
            nameIsInitial: this.nameIsInitial,
            nameIsVirtual: this.nameIsVirtual,
            namePath: this.namePath,
            nocreate: this.options.nocreate,
            nodelete: this.options.nodelete,
            noedit: this.options.noedit,
            path: this.path,
            perPage: this.options.perPage,
            plural: this.plural,
            searchFields: this.options.searchFields,
            singular: this.singular,
            sortable: this.options.sortable,
            sortContext: this.options.sortContext,
            track: this.options.track,
            tracking: this.tracking,
            relationships: this.relationships,
            uiElements: [],
        };
        _.forEach(this.uiElements, (el) => {
            switch (el.type) {
                // TODO: handle indentation
                case 'field':
                    // add the field options by path
                    ops.fields[el.field.path] = el.field.getOptions();
                    // don't output hidden fields
                    if (el.field.hidden) {
                        return;
                    }
                    // add the field to the elements array
                    ops.uiElements.push({
                        type: 'field',
                        field: el.field.path,
                    });
                    break;
                case 'heading':
                    ops.uiElements.push({
                        type: 'heading',
                        content: el.heading,
                        options: el.options,
                    });
                    break;
            }
        });
        return ops;
    }

    /**
     * Generate page array for pagination
     *
     * @param {Number} the maximum number pages to display in the pagination
     * @param {Object} page options
     */
    getPages(options, maxPages) {
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

    /**
     * Gets filters for a Mongoose query that will search for the provided string,
     * based on the searchFields List option.
     *
     * Also accepts a filters object from `processFilters()`, any of which may
     * override the search string.
     *
     * NOTE: This function is deprecated in favor of List.prototype.addSearchToQuery
     * and will be removed in a later version.
     *
     * Example:
     *     list.getSearchFilters('jed') // returns { name: /jed/i }
     *
     * @param {String} query
     * @param {Object} additional filters
     */
    getSearchFilters(search, add) {
        const debug = _debug('keystone:core:list:getSearchFilters');
        let filters: any = {};

        search = String(search || '').trim();

        if (search.length) {
            // Use the text index the behaviour is enabled by the list schema
            // Usually, when searchUsesTextIndex is true, list.register() will maintain an index using ensureTextIndex()
            // However, it's possible for searchUsesTextIndex to be true while there is an existing text index on the collection that *isn't* described in the list schema
            // If this occurs, an error will be reported when list.register() is called and the existing index will not be replaced, meaning it will be used here
            if (this.options.searchUsesTextIndex) {
                filters.$text = { $search: search };
            }
            else {
                let searchFilter;
                const searchParts = search.split(' ');
                const searchRx = new RegExp(utils.escapeRegExp(search), 'i');
                const splitSearchRx = new RegExp((searchParts.length > 1) ? _.map(searchParts, utils.escapeRegExp).join('|') : search, 'i');
                let searchFields = this.get('searchFields');
                const searchFilters = [];
                const searchIdField = utils.isValidObjectId(search);

                if (typeof searchFields === 'string') {
                    searchFields = searchFields.split(',');
                }

                searchFields.forEach(function (path) {
                    path = path.trim();

                    if (path === '__name__') {
                        path = this.mappings.name;
                    }

                    const field = this.fields[path];

                    if (field && field.type === 'name') {
                        const first = {};
                        first[field.paths.first] = splitSearchRx;
                        const last = {};
                        last[field.paths.last] = splitSearchRx;
                        searchFilter = {};
                        searchFilter.$or = [first, last];
                        searchFilters.push(searchFilter);
                    } else {
                        searchFilter = {};
                        searchFilter[path] = searchRx;
                        searchFilters.push(searchFilter);
                    }
                });

                if (this.autokey) {
                    searchFilter = {};
                    searchFilter[this.autokey.path] = searchRx;
                    searchFilters.push(searchFilter);
                }

                if (searchIdField) {
                    searchFilter = {};
                    searchFilter._id = search;
                    searchFilters.push(searchFilter);
                }

                if (searchFilters.length > 1) {
                    filters.$or = searchFilters;
                } else if (searchFilters.length) {
                    filters = searchFilters[0];
                }
            }
        }

        if (add) {
            _.forEach(add, (filter) => {
                let cond;
                const path = filter.key;
                let value = filter.value;

                switch (filter.field.type) {
                    case 'boolean':
                        if (!value || value === 'false') {
                            filters[path] = { $ne: true };
                        } else {
                            filters[path] = true;
                        }
                        break;

                    case 'localfile':
                    case 'cloudinaryimage':
                    case 'cloudinaryimages':
                    case 's3file':
                    case 'name':
                    case 'password':
                        // TODO
                        break;

                    case 'location':
                        _.forEach(['street1', 'suburb', 'state', 'postcode', 'country'], function (pathKey, i) {
                            const value = filter.value[i];
                            if (value) {
                                filters[filter.field.paths[pathKey]] = new RegExp(utils.escapeRegExp(value), 'i');
                            }
                        });
                        break;

                    case 'relationship':
                        if (value) {
                            if (filter.field.many) {
                                filters[path] = (filter.inverse) ? { $nin: [value] } : { $in: [value] };
                            } else {
                                filters[path] = (filter.inverse) ? { $ne: value } : value;
                            }
                        } else {
                            if (filter.field.many) {
                                filters[path] = (filter.inverse) ? { $not: { $size: 0 } } : { $size: 0 };
                            } else {
                                filters[path] = (filter.inverse) ? { $ne: null } : null;
                            }
                        }
                        break;

                    case 'select':
                        if (filter.value) {
                            filters[path] = (filter.inverse) ? { $ne: value } : value;
                        } else {
                            filters[path] = (filter.inverse) ? { $nin: ['', null] } : { $in: ['', null] };
                        }
                        break;

                    case 'number':
                    case 'money':
                        if (filter.operator === 'bt') {
                            value = [
                                utils.number(value[0]),
                                utils.number(value[1]),
                            ];
                            if (!isNaN(value[0]) && !isNaN(value[1])) {
                                filters[path] = {
                                    $gte: value[0],
                                    $lte: value[1],
                                };
                            }
                            else {
                                filters[path] = null;
                            }
                        } else {
                            value = utils.number(value);
                            if (!isNaN(value)) {
                                if (filter.operator === 'gt') {
                                    filters[path] = { $gt: value };
                                }
                                else if (filter.operator === 'lt') {
                                    filters[path] = { $lt: value };
                                }
                                else {
                                    filters[path] = value;
                                }
                            }
                            else {
                                filters[path] = null;
                            }
                        }
                        break;

                    case 'date':
                    case 'datetime':
                        if (filter.operator === 'bt') {
                            value = [
                                moment(value[0]),
                                moment(value[1]),
                            ];
                            if ((value[0] && value[0].isValid()) && (value[1] && value[0].isValid())) {
                                filters[path] = {
                                    $gte: moment(value[0]).startOf('day').toDate(),
                                    $lte: moment(value[1]).endOf('day').toDate(),
                                };
                            }
                        } else {
                            value = moment(value);
                            if (value && value.isValid()) {
                                const start = moment(value).startOf('day').toDate();
                                const end = moment(value).endOf('day').toDate();
                                if (filter.operator === 'gt') {
                                    filters[path] = { $gt: end };
                                } else if (filter.operator === 'lt') {
                                    filters[path] = { $lt: start };
                                } else {
                                    filters[path] = { $lte: end, $gte: start };
                                }
                            }
                        }
                        break;

                    case 'text':
                    case 'textarea':
                    case 'html':
                    case 'email':
                    case 'url':
                    case 'key':
                        if (filter.exact) {
                            if (value) {
                                cond = new RegExp('^' + utils.escapeRegExp(value) + '$', 'i');
                                filters[path] = filter.inverse ? { $not: cond } : cond;
                            } else {
                                if (filter.inverse) {
                                    filters[path] = { $nin: ['', null] };
                                } else {
                                    filters[path] = { $in: ['', null] };
                                }
                            }
                        } else if (value) {
                            cond = new RegExp(utils.escapeRegExp(value), 'i');
                            filters[path] = filter.inverse ? { $not: cond } : cond;
                        }
                        break;

                }
            });
        }

        debug("Applying filters to list '" + this.key + "':", filters);
        return filters;
    }

    /**
     * Gets a unique value from a generator method by checking for documents with the same value.
     *
     * To avoid infinite loops when a unique value cannot be found, it will bail and pass back an
     * undefined value after 10 attemptes.
     *
     * WARNING: Because there will always be a small amount of time between checking for an
     * existing value and saving a document, race conditions can occur and it is possible that
     * another document has the 'unique' value assigned at the same time.
     *
     * Because of this, if true uniqueness is required, you should also create a unique index on
     * the database path, and handle duplicate errors thrown on save.
     *
     * @param {String} path to check for uniqueness
     * @param {Function} generator method to call to generate a new value
     * @param {Number} the maximum number of attempts (optional, defaults to 10)
     * @param {Function} callback(err, uniqueValue)
     */
    getUniqueValue(path, generator, limit, callback) {
        const model = this.model;
        let count = 0;
        let value;
        if (typeof limit === 'function') {
            callback = limit;
            limit = 10;
        }
        if (Array.isArray(generator)) {
            const fn = generator[0];
            const args = generator.slice(1);
            generator = () => {
                return fn.apply(this, args);
            };
        }
        const check = () => {
            if (count++ > 10) {
                return callback(undefined, undefined);
            }
            value = generator();
            model.count().where(path, value).exec(function (err, matches) {
                if (err) return callback(err);
                if (matches) return check();
                callback(undefined, value);
            });
        };
        check();
    }

    /**
     * Check whether or not a `path` is a reserved path. This restricts the use
     * of `Object.prototype` method keys as well as internal mongo paths.
     */
    isReserved(path) {
        return reservedPaths.indexOf(path) >= 0;
    }

    /**
     * Maps a built-in field (e.g. name) to a specific path
     */
    map(field, path) {
        if (path) {
            this.mappings[field] = path;
        }
        return this.mappings[field];
    }

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
    paginate(options, callback) {
        // const model = this.model;

        options = options || {};

        const query = this.model.find(options.filters, options.optionalExpression);
        const countQuery = this.model.find(options.filters);

        query._original_exec = query.exec;
        query._original_sort = query.sort;
        query._original_select = query.select;

        const currentPage = Number(options.page) || 1;
        const resultsPerPage = Number(options.perPage) || 50;
        const maxPages = Number(options.maxPages) || 10;
        const skip = (currentPage - 1) * resultsPerPage;

        this.pagination = { maxPages: maxPages };

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

        query.exec = (callback) => {
            countQuery.count((err, count) => {
                if (err) callback(err);

                query.find().limit(resultsPerPage).skip(skip);

                // apply the select and sort options before calling exec
                if (options.select) {
                    query._original_select(options.select);
                }

                if (options.sort) {
                    query._original_sort(options.sort);
                }

                query._original_exec((err, results) => {
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
                    this.getPages(rtn, maxPages);
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

    /**
     * Processes a filter string into a filters object
     *
     * NOTE: This function is deprecated in favor of List.prototype.addFiltersToQuery
     * and will be removed in a later version.
     *
     * @param {String} filters
     */
    processFilters(q) {
        const list = this;
        const filters = {};
        queryfilterlib.QueryFilters.create(q).getFilters().forEach(function (filter) {
            filter.path = filter.key; // alias for b/c
            filter.field = list.fields[filter.key];
            filters[filter.path] = filter;
        });
        return filters;
    }

    /**
     * Registers the Schema with Mongoose, and the List with Keystone
     *
     * Also adds default fields and virtuals to the schema for the list
     */
    register() {
        const debug = _debug('keystone:core:list:register');
        const keystone = List.keystone;
        const list = this;
        /* Handle deprecated options */
        if (this.schema.methods.toCSV) {
            console.warn(this.key + ' Warning: List.schema.methods.toCSV support has been removed from KeystoneJS.\nPlease use getCSVData instead (see the 0.3 -> 4.0 Upgrade Guide)\n');
        }
        /* Apply Plugins */
        if (this.get('sortable')) {
            schemaPlugins.sortable.apply(this);
        }
        if (this.get('autokey')) {
            schemaPlugins.autokey.apply(this);
        }
        if (this.get('track')) {
            schemaPlugins.track.apply(this);
        }
        if (this.get('history')) {
            schemaPlugins.history.apply(this);
        }
        this.schema.virtual('list').get(function () {
            return list;
        });
        /* Add common methods to the schema */
        if (Object.keys(this.relationships).length) {
            this.schema.methods.getRelated = schemaPlugins.methods.getRelated;
            this.schema.methods.populateRelated = schemaPlugins.methods.populateRelated;
            if (!this.schema.options.toObject) this.schema.options.toObject = {};
            this.schema.options.toObject.transform = schemaPlugins.options.transform;
        }
        this.schema.virtual('_').get(function () {
            if (!this.__methods) {
                this.__methods = utils.bindMethods(list.underscoreMethods, this);
            }
            return this.__methods;
        });
        this.schema.method('getUpdateHandler', function (req, res, ops) {
            return new UpdateHandler(list, this, req, res, ops);
        });
        /* Apply list inheritance */
        if (this.get('inherits')) {
            this.model = this.get('inherits').model.discriminator(this.key, this.schema);
        } else {
            this.model = keystone.mongoose.model(this.key, this.schema);
        }
        /* Setup search text index */
        if (this.options.searchUsesTextIndex && !this.declaresTextIndex()) {
            // If the list is configured to use a text index for search and the list
            // doesn't explicitly define one, create (or update) one of our own
            this.ensureTextIndex(function () {
                debug("this.ensureTextIndex() done for '" + list.key + "'");
            });
        }
        /* Register the list and its field types on the Keystone instance */
        keystone.lists[this.key] = this;
        keystone.paths[this.path] = this.key;
        Object.assign(keystone.fieldTypes, this.fieldTypes);
        /* Add listeners for model events */
        // see http://mongoosejs.com/docs/api.html#model_Model
        this.model.on('index', function (err) {
            if (err) console.error("Mongoose model 'index' event fired on '" + list.key + "' with error:\n", err.message, err.stack);
        });
        this.model.on('index-single-start', function (index) {
            debug("Mongoose model 'index-single-start' event fired on '" + list.key + "' for index:\n", index);
        });
        this.model.on('index-single-done', function (err, index) {
            if (err) console.error("Mongoose model 'index-single-done' event fired on '" + list.key + "' for index:\n", index, '\nWith error:\n', err.message, err.stack);
            else debug("Mongoose model 'index-single-done' event fired on '" + list.key + "' for index:\n", index);
        });
        this.model.on('error', function (err) {
            if (err) console.error("Mongoose model 'error' event fired on '" + list.key + "' with error:\n", err.message, err.stack);
        });
        return this;
    }

    /**
     * Registers relationships to this list defined on others
     */
    relationship(def) {
        // const keystone = List.keystone;
        if (arguments.length > 1) {
            for (let i = 0; i < arguments.length; i++) {
                this.relationship(arguments[i]);
            }
            return this;
        }
        if (typeof def === 'string') {
            def = { ref: def };
        }
        if (!def.ref) {
            throw new Error('List Relationships must be specified with an object containing ref (' + this.key + ')');
        }
        if (!def.refPath) {
            def.refPath = utils.downcase(this.key);
        }
        if (!def.path) {
            def.path = utils.keyToProperty(def.ref, true);
        }
        Object.defineProperty(def, 'refList', {
            get: function () {
                return keystone.list(def.ref);
            },
        });
        Object.defineProperty(def, 'isValid', {
            get: function () {
                return keystone.list(def.ref) ? true : false;
            },
        });
        this.relationships[def.path] = def;
        return this;
    }

    /**
     * Specified select and populate options for a query based the provided columns.
     *
     * @param {Query} query
     * @param {Array} columns
     */
    selectColumns(q, cols) {
        // Populate relationship columns
        const select = [];
        const populate = {};
        let path;
        cols.forEach(function (col) {
            select.push(col.path);
            if (col.populate) {
                if (!populate[col.populate.path]) {
                    populate[col.populate.path] = [];
                }
                populate[col.populate.path].push(col.populate.subpath);
            }
        });
        q.select(select.join(' '));
        for (path in populate) {
            if (populate.hasOwnProperty(path)) {
                q.populate(path, populate[path].join(' '));
            }
        }
    }

    /**
     * Gets and Sets list options. Aliased as .get()
     *
     * Example:
     *     list.set('test') // returns the 'test' value
     *     list.set('test', value) // sets the 'test' option to `value`
     */
    set(key, value?) {
        if (arguments.length === 1) {
            return this.options[key];
        }
        this.options[key] = value;
        return value;
    }

    /**
     * Adds a method to the underscoreMethods collection on the list, which is then
     * added to the schema before the list is registered with mongoose.
     */
    underscoreMethod(path, fn) {
        let target = this.underscoreMethods;
        path = path.split('.');
        const last = path.pop();
        path.forEach(function (part) {
            if (!target[part]) target[part] = {};
            target = target[part];
        });
        target[last] = fn;
        return this;
    }

    updateItem(item, data, options, callback) {
        /* Process arguments and options */
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        if (!options) {
            options = {};
        }

        // update fields with noedit: true set if fields have been explicitly
        // provided, or if the ignoreNoEdit option is true
        const ignoreNoEdit = !!(options.fields || options.ignoreNoEdit);

        // fields defaults to all the fields in the list
        let fields = options.fields || this.fieldsArray;
        // fields can be a list or array of field paths or Field instances
        fields = listToArray(fields).map(function (field) {
            // TODO: Check that field is an instance of Field
            return (typeof field === 'string') ? this.fields[field] : field;
        }, this);
        // check for invalid fields
        if (fields.indexOf(undefined) >= 0) {
            return callback({
                error: 'invalid configuration',
                detail: 'Invalid path specified in fields to update [' + options.fields + '] for list ' + this.key,
            });
        }

        // Strip out noedit fields
        if (!ignoreNoEdit) {
            fields = fields.filter(function (i) {
                return !i.noedit;
            });
        }

        // you can optionally require fields that aren't required in the schema
        // note that if fields are required in the schema, they will always be checked
        //
        // this option supports the backwards compatible { path: true } format, or a
        // list or array of field paths to validate
        let requiredFields = options.required;
        let requiredFieldPaths = {};
        if (typeof requiredFields === 'string') {
            requiredFields = listToArray(requiredFields);
        }
        if (Array.isArray(requiredFields)) {
            requiredFields.forEach(function (path) {
                requiredFieldPaths[path] = true;
            });
        } else if (typeof requiredFields === 'object') {
            requiredFieldPaths = requiredFields;
        }

        /* Field Validation */
        // TODO: If a field is required but not specified in the provided fields array
        // we should explicitly include it in the set of fields to validate
        const validationErrors = {};
        function doFieldValidation(field, done) {
            // Note; we don't pass back validation errors to the callback, because we don't
            // want to break the async loop before all the fields have been validated.
            field.validateInput(data, function (valid, detail) {
                if (!valid) {
                    addValidationError(options, validationErrors, field, 'invalid', detail);
                    done();
                } else {
                    if ((field.required || requiredFieldPaths[field.path])
                        && (!field.dependsOn || evalDependsOn(field.dependsOn, data))) {
                        field.validateRequiredInput(item, data, function (valid, detail) {
                            if (!valid) {
                                addValidationError(options, validationErrors, field, 'required', detail);
                            }
                            done();
                        });
                    } else {
                        done();
                    }
                }
            });
        }

        /* Field Updates */
        const updateErrors = {};
        function doFieldUpdate(field, done) {
            const callback = function (err) {
                // Note; we don't pass back errors to the callback, because we don't want
                // to break the async loop before all the fields have been updated.
                if (err) {
                    addFieldUpdateError(updateErrors, field, err);
                }
                done();
            };
            // all fields have (item, data) as the first two arguments
            const updateArgs = [item, data];
            // some fields support an optional third argument: files
            if (field.updateItem.length > 3) {
                updateArgs.push(options.files);
            }
            // callback is always the last argument
            updateArgs.push(callback);
            // call field.updateItem with the arguments
            field.updateItem.apply(field, updateArgs);
        }

        /* Track plugin support */
        // If the track plugin is enabled for the list, it looks for ._req_user to
        // detect the user that performed the updated. Default it to the user
        // specified in the options.
        if (options.user) {
            item._req_user = options.user;
        }

        /* Flow control */
        async.series([
            /* Process validation */
            function (doneValidation) {
                async.each(fields, doFieldValidation, function () {
                    if (Object.keys(validationErrors).length) {
                        return doneValidation({
                            error: 'validation errors',
                            detail: validationErrors,
                        });
                    }
                    doneValidation();
                });
            },
            /* Apply updates to fields */
            function (doneUpdate) {
                async.each(fields, doFieldUpdate, function () {
                    if (Object.keys(updateErrors).length) {
                        return doneUpdate({
                            error: 'field errors',
                            detail: updateErrors,
                        });
                    }
                    item.save(doneUpdate);
                });
            },
        ],

            /* Done */
            function (err) {
                if (err) {
                    if (err instanceof Error) {
                        // Try to make mongoose index constraint errors more friendly
                        // This is brittle, but should return a more human-readable error message
                        if ((<any>err).code === 11000) {
                            const indexConstraintError = MONGO_INDEX_CONSTRAINT_ERROR_REGEXP.exec((<any>err).errmsg);
                            if (indexConstraintError) {
                                let probableFieldPath = indexConstraintError[1];
                                probableFieldPath = probableFieldPath.substr(0, probableFieldPath.lastIndexOf('_'));
                                return callback({
                                    error: 'database error',
                                    detail: 'Duplicate ' + probableFieldPath + ' value "' + indexConstraintError[2] + '" already exists',
                                });
                            }
                        }
                        // Wrap Error objects in the standard format, they're most likely
                        // a database error (not sure if we can make this more specific?)
                        return callback({
                            error: 'database error',
                            detail: err,
                        });
                    } else {
                        // Return other error object directly
                        return callback(err);
                    }
                }
                return callback();
            });
    }
}

function combineQueries(a, b) {
    if (a.$or && b.$or) {
        if (!a.$and) {
            a.$and = [];
        }
        a.$and.push({ $or: a.$or });
        delete a.$or;
        b.$and.push({ $or: b.$or });
        delete b.$or;
    }
    return Object.assign(a, b);
}


function trim(i) { return i.trim(); }
function truthy(i) { return i; }

function getNameFilter(field, searchString) {
    const searchWords = searchString.split(' ').map(trim).filter(truthy).map(utils.escapeRegExp);
    const nameSearchRegExp = new RegExp(searchWords.join('|'), 'i');
    const first = {};
    first[field.paths.first] = nameSearchRegExp;
    const last = {};
    last[field.paths.last] = nameSearchRegExp;
    return {
        $or: [first, last],
    };
}

function getStringFilter(path, searchRegExp) {
    const filter = {};
    filter[path] = searchRegExp;
    return filter;
}


// A basic string hashing function
function hashString(string) {
    let char;
    let hash = 0;
    if (string.length === 0) return hash;
    for (let i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}


/**
 * Applies option field transforms to get the CSV value for a field
 */

function transformFieldValue(field, item, options) {
    const transform = typeof field.options.toCSV === 'string'
        ? listToArray(field.options.toCSV)
        : field.options.toCSV;
    if (typeof transform === 'function') {
        return transform.call(item, field, options);
    }
    if (Array.isArray(transform)) {
        const value = item.get(field.path);
        if (transform.length === 1) {
            return value[transform[0]];
        } else {
            return _.pick(value, transform);
        }
    }
    return field.format(item);
}

const reservedPaths = [
    '_',
    '__defineGetter__',
    '__defineSetter__',
    '__lookupGetter__',
    '__lookupSetter__',
    '__proto__',
    '_id',
    'hasOwnProperty',
    'id',
    'isPrototypeOf',
    'list',
    'propertyIsEnumerable',
    'prototype',
    'toLocaleString',
    'toString',
    'valueOf',
];

const MONGO_INDEX_CONSTRAINT_ERROR_REGEXP = /E11000 duplicate key error index\: [^\$]+\$(\w+) dup key\: \{ \: "([^"]+)" \}/;

// Adds a validation message to the errors object in the common format
function addValidationError(options, errors, field, type, detail) {
    if (detail instanceof Error) {
        detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
    }
    let error = '';
    if (typeof detail === 'string') {
        error = detail;
    } else {
        if (type === 'required' && options.requiredMessages && options.requiredMessages[field.path]) {
            error = options.requiredMessages[field.path];
        } else if (type === 'invalid' && options.invalidMessages && options.invalidMessages[field.path]) {
            error = options.invalidMessages[field.path];
        } else {
            error = field.path.substr(0, 1).toUpperCase() + field.path.substr(1) + ' is ' + type;
        }
    }
    errors[field.path] = {
        type: type,
        error: error,
        detail: typeof detail === 'object' ? detail : undefined,
        fieldLabel: field.label,
        fieldType: field.type,
    };
}

// Adds a field update error message to the errors object in the common format
function addFieldUpdateError(errors, field, detail) {
    if (detail instanceof Error) {
        detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
    }
    errors[field.path] = {
        error: typeof detail === 'string' ? detail : field.path + ' error',
        detail: typeof detail === 'object' ? detail : undefined,
        fieldLabel: field.label,
        fieldType: field.type,
    };
}
