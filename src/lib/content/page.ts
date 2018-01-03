import * as _ from 'lodash';
import * as assign from 'object-assign';
import { Keystone } from '../../keystone';
import * as utils from 'keystone-utils';
import { Type } from './type';

/**
 * Page Class
 *
 * @param {String} key
 * @param {Object} options
 * @api public
 */
export class Page {
    fields: {};
    key: any;
    options: any;


    constructor(key, options) {

        if (!(this instanceof Page)) {
            return new Page(key, options);
        }

        this.options = assign({}, options);
        this.key = key;
        this.fields = {};

    }


    get name() {
        return this.get('name') || this.set('name', utils.keyToLabel(this.key));
    }
    /**
     * Sets page option
     *
     * ####Example:
     *
     *     page.set('test', value) // sets the 'test' option to `value`
     *
     * @param {String} key
     * @param {String} value
     * @return value
     * @api public
     */

    set(key, value) {

        if (!key) {
            throw new Error('keystone.content.Page.set() Error: must be provided with a key to set a value.');
        }

        value = value || null;
        this.options[key] = value;
        return value;

    }


    /**
     * Gets page option
     *
     * ####Example:
     *
     *     page.get('test') // returns the value of 'test' key
     *
     * @param {String} key
     * @return any
     * @method get
     * @api public
     */

    get(key) {
        if (!key) {
            throw new Error('keystone.content.Paget.get() Error: must be provided with a key to get a value.');
        }

        if (!this.options.hasOwnProperty(key)) {
            return null;
        }

        return this.options[key];
    }

    /**
     * Adds one or more fields to the page
     *
     * @api public
     */

    add(fields) {

        // TODO: nested paths
        if (!utils.isObject(fields)) {
            throw new Error('keystone.content.Page.add() Error: fields must be an object.');
        }

        const self = this;

        _.forEach(fields, function (options, path) {

            if (typeof options === 'function') {
                options = { type: options };
            }

            if (typeof options.type !== 'function') {
                throw new Error('keystone.content.page.add() Error: Page fields must be specified with a type function');
            }

            if (options.type.prototype.__proto__ !== Type.prototype) { // eslint-disable-line no-proto

                // Convert native field types to their default Keystone counterpart

                if (options.type === String) {
                    options.type = keystone.content.Types.Text;
                }

                // TODO: More types
                // else if (options.type == Number)
                // 	options.type = Field.Types.Number;
                // else if (options.type == Boolean)
                // 	options.type = Field.Types.Boolean;
                // else if (options.type == Date)
                // 	options.type = Field.Types.Datetime;

                else {
                    throw new Error('keystone.content.page.add() Error: Unrecognised field constructor: ' + options.type);
                }

            }

            self.fields[path] = new options.type(path, options);

        });

        return this;

    }

    /**
     * Registers the page with Keystone.
     *
     * ####Example:
     *
     * 		var homePage = new keystone.content.Page('home');
     * 		// ...
     * 		homePage.register();
     *
     * 		// later...
     * 		var homePage = keystone.content.page('home');
     *
     * @api public
     */

    register() {
        return keystone.content.page(this.key, this);
    }

    /**
     * Populates a data structure based on defined fields
     *
     * @api public
     */

    populate(data) {

        if (typeof data !== 'object') {
            data = {};
        }

        // TODO: implement schema

        return data;

    }

    /**
     * Validates a data structure based on defined fields
     *
     * @api public
     */

    validate(data) {

        if (typeof data !== 'object') {
            data = {};
        }

        // TODO: implement schema

        return data;

    }

    /**
     * Cleans a data structure so only the defined fields are present
     *
     * @api public
     */

    clean(data) {

        if (typeof data !== 'object') {
            data = {};
        }

        // TODO: implement schema

        return data;

    }

}

