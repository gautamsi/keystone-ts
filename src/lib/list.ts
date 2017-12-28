import { Keystone } from '../../src/keystone';

import { Schema } from 'mongoose';

import * as _ from 'lodash';
import * as utils from 'keystone-utils';


export class List {
    static keystone: Keystone;
    _initialFields: any;
    model: any;
    fieldTypes: {};
    relationshipFields: any[];
    relationships: {};
    mappings: { name: any; createdBy: any; createdOn: any; modifiedBy: any; modifiedOn: any; };
    fieldsArray: any[];
    fields: {};
    underscoreMethods: {};
    uiElements: any[];
    schemaFields: any[];
    schema: any;
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
        if (!(this instanceof List)) return new List(key, options);

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
    add = require('./list/add');
    addFiltersToQuery = require('./list/addFiltersToQuery');
    addSearchToQuery = require('./list/addSearchToQuery');
    automap = require('./list/automap');
    apiForGet = require('./list/apiForGet');
    expandColumns = require('./list/expandColumns');
    expandPaths = require('./list/expandPaths');
    expandSort = require('./list/expandSort');
    field = require('./list/field');
    set = require('./list/set');
    get = this.set;
    getAdminURL = require('./list/getAdminURL');
    getCSVData = require('./list/getCSVData');
    getData = require('./list/getData');
    getDocumentName = require('./list/getDocumentName');
    getOptions = require('./list/getOptions');
    getPages = require('./list/getPages');
    getSearchFilters = require('./list/getSearchFilters');
    getUniqueValue = require('./list/getUniqueValue');
    isReserved = require('./list/isReserved');
    map = require('./list/map');
    paginate = require('./list/paginate');
    processFilters = require('./list/processFilters');
    register = require('./list/register');
    relationship = require('./list/relationship');
    selectColumns = require('./list/selectColumns');
    updateItem = require('./list/updateItem');
    underscoreMethod = require('./list/underscoreMethod');
    buildSearchTextIndex = require('./list/buildSearchTextIndex');
    declaresTextIndex = require('./list/declaresTextIndex');
    ensureTextIndex = require('./list/ensureTextIndex');
}
