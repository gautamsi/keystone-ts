import * as marked from 'marked';
import * as sanitizeHtml from 'sanitize-html';
import { TextType } from '../text/TextType';
import * as utils from 'keystone-utils';

/**
 * Markdown FieldType Constructor
 * @extends Field
 * @api public
 */
export class MarkdownType extends TextType {
    paths: any;
    wysiwyg: boolean;
    height: number;
    sanitizeOptions: any;
    markedOptions: any;
    toolbarOptions: any;


    constructor(list, path, options) {
        super(list, path, options);
    }
    protected init() {
        super.init();
        this._defaultSize = 'full';

        this.toolbarOptions = this.options.toolbarOptions || {};
        this.markedOptions = this.options.markedOptions || {};

        // See sanitize-html docs for defaults
        // .. https://www.npmjs.com/package/sanitize-html#what-are-the-default-options
        this.sanitizeOptions = this.options.sanitizeOptions || {};

        this.height = this.options.height || 90;
        this.wysiwyg = ('wysiwyg' in this.options) ? this.options.wysiwyg : true;

        this._properties = ['wysiwyg', 'height', 'toolbarOptions'];
    }
    static properName = 'Markdown';

    /**
     * Registers the field on the List's Mongoose Schema.
     *
     * Adds String properties for .md and .html markdown, and a setter for .md
     * that generates html when it is updated.
     */
    addToSchema(schema) {

        const paths = this.paths = {
            md: this.path + '.md',
            html: this.path + '.html',
        };

        const markedOptions = this.markedOptions;
        const sanitizeOptions = this.sanitizeOptions;

        const setMarkdown = function (value) {
            // Clear if saving invalid value
            if (typeof value !== 'string') {
                this.set(paths.md, undefined);
                this.set(paths.html, undefined);

                return undefined;
            }

            const newMd = sanitizeHtml(value, sanitizeOptions);
            const newHtml = marked(newMd, markedOptions);

            // Return early if no changes to save
            if (newMd === this.get(paths.md) && newHtml === this.get(paths.html)) {
                return newMd;
            }

            this.set(paths.md, newMd);
            this.set(paths.html, newHtml);

            return newMd;
        };

        schema.nested[this.path] = true;
        schema.add({
            html: { type: String },
            md: { type: String, set: setMarkdown },
        }, this.path + '.');

        this.bindUnderscoreMethods();
    }

    /**
     * Add filters to a query (this is copy & pasted from the text field, with
     * the only difference being that the path isn't this.path but this.paths.md)
     */
    addFilterToQuery(filter) {
        const query = {};
        if (filter.mode === 'exactly' && !filter.value) {
            query[this.paths.md] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
            return query;
        }
        let value = utils.escapeRegExp(filter.value);
        if (filter.mode === 'beginsWith') {
            value = '^' + value;
        } else if (filter.mode === 'endsWith') {
            value = value + '$';
        } else if (filter.mode === 'exactly') {
            value = '^' + value + '$';
        }
        value = new RegExp(value, filter.caseSensitive ? '' : 'i');
        query[this.paths.md] = filter.inverted ? { $not: value } : value;
        return query;
    }

    /**
     * Formats the field value
     */
    format(item) {
        return item.get(this.paths.html);
    }

    /**
     * Gets the field's data from an Item, as used by the React components
     */
    getData(item) {
        const value = item.get(this.path);
        return typeof value === 'object' ? value : {};
    }

    /**
     * Validates that a value for this field has been provided in a data object
     *
     * Deprecated
     */
    inputIsValid(data, required, item) {
        if (!(this.path in data) && item && item.get(this.paths.md)) {
            return true;
        }
        return (!required || data[this.path]) ? true : false;
    }

    /**
     * Detects whether the field has been modified
     */
    isModified(item) {
        return item.isModified(this.paths.md);
    }

    /**
     * Updates the value for this field in the item from a data object
     *
     * Will accept either the field path, or paths.md
     */
    updateItem(item, data, callback) {
        const value = this.getValueFromData(data);
        if (value !== undefined) {
            item.set(this.paths.md, value);
        } else if (this.paths.md in data) {
            item.set(this.paths.md, data[this.paths.md]);
        }
        process.nextTick(callback);
    }

}

