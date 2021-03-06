import * as _ from 'lodash';
import { Keystone } from '../../../keystone';
const keystone = Keystone.instance;
import * as EmbedlyAPI from 'embedly';
import { FieldTypeBase } from '../FieldTypeBase';

/**
 * Embedly FieldType Constructor
 *
 * Reqires the option `from` to refer to another path in the schema
 * that provides the url to expand
 *
 * @extends Field
 * @api public
 */
export class EmbedlyType extends FieldTypeBase {
    paths: any;
    fromPath: any;
    embedlyOptions: any;

    constructor(list, path, options) {

        super(list, path, options);

    }
    protected init() {
        super.init();
        this._underscoreMethods = ['reset'];
        this._fixedSize = 'full';
        this.fromPath = this.options.from;
        this.embedlyOptions = this.options.options || {};

        // check and api key has been set, or bail.
        if (!keystone.get('embedly api key')) {
            throw new Error('Invalid Configuration\n\n'
                + 'Embedly fields (' + this.list.key + '.' + this.path + ') require the "embedly api key" option to be set.\n\n'
                + 'See http://keystonejs.com/docs/configuration/#services-embedly for more information.\n');
        }

        // ensure a fromPath has been defined
        if (!this.options.from) {
            throw new Error('Invalid Configuration\n\n'
                + 'Embedly fields (' + this.list.key + '.' + this.path + ') require a fromPath option to be set.\n'
                + 'See http://keystonejs.com/docs/database/#fieldtypes-embedly for more information.\n');
        }

        // embedly fields cannot be set as initial fields
        if (this.options.initial) {
            throw new Error('Invalid Configuration\n\n'
                + 'Embedly fields (' + this.list.key + '.' + this.path + ') cannot be set as initial fields.\n');
        }
    }

    static properName = 'Embedly';

    /**
     * Registers the field on the List's Mongoose Schema.
     *
     * @api public
     */
    addToSchema(schema) {

        const field = this;

        this.paths = {
            exists: this.path + '.exists',
            type: this.path + '.type',
            title: this.path + '.title',
            url: this.path + '.url',
            width: this.path + '.width',
            height: this.path + '.height',
            version: this.path + '.version',
            description: this.path + '.description',
            html: this.path + '.html',
            authorName: this.path + '.authorName',
            authorUrl: this.path + '.authorUrl',
            providerName: this.path + '.providerName',
            providerUrl: this.path + '.providerUrl',
            thumbnailUrl: this.path + '.thumbnailUrl',
            thumbnailWidth: this.path + '.thumbnailWidth',
            thumbnailHeight: this.path + '.thumbnailHeight',
        };

        schema.nested[this.path] = true;
        schema.add({
            exists: Boolean,
            type: String,
            title: String,
            url: String,
            width: Number,
            height: Number,
            version: String,
            description: String,
            html: String,
            authorName: String,
            authorUrl: String,
            providerName: String,
            providerUrl: String,
            thumbnailUrl: String,
            thumbnailWidth: Number,
            thumbnailHeight: Number,
        }, this.path + '.');

        // Bind the pre-save hook to hit the embedly api if the source path has changed

        schema.pre('save', function (next) {

            if (!this.isModified(field.fromPath)) {
                return next();
            }

            const fromValue = this.get(field.fromPath);

            if (!fromValue) {
                field.reset(this);
                return next();
            }

            const post = this;

            const api = new EmbedlyAPI({ key: keystone.get('embedly api key') });
            const opts = _.defaults({ url: fromValue }, field.embedlyOptions);

            api.oembed(opts, function (err, objs) {
                if (err) {
                    console.error('Embedly API Error:');
                    console.error(err, objs);
                    field.reset(post);
                } else {
                    const data = objs[0];
                    if (data && data.type !== 'error') {
                        post.set(field.path, {
                            exists: true,
                            type: data.type,
                            title: data.title,
                            url: data.url,
                            width: data.width,
                            height: data.height,
                            version: data.version,
                            description: data.description,
                            html: data.html,
                            authorName: data.author_name,
                            authorUrl: data.author_url,
                            providerName: data.provider_name,
                            providerUrl: data.provider_url,
                            thumbnailUrl: data.thumbnail_url,
                            thumbnailWidth: data.thumbnail_width,
                            thumbnailHeight: data.thumbnail_height,
                        });
                    } else {
                        field.reset(post);
                    }
                }
                return next();
            });
        });

        this.bindUnderscoreMethods();

    }

    /**
     * Resets the value of the field
     *
     * @api public
     */
    reset(item) {
        return item.set(item.set(this.path, {
            exists: false,
            type: null,
            title: null,
            url: null,
            width: null,
            height: null,
            version: null,
            description: null,
            html: null,
            authorName: null,
            authorUrl: null,
            providerName: null,
            providerUrl: null,
            thumbnailUrl: null,
            thumbnailWidth: null,
            thumbnailHeight: null,
        }));
    }

    /**
     * Formats the field value
     *
     * @api public
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
     * Detects whether the field has been modified
     *
     * @api public
     */
    isModified(item) {
        // Assume that it has changed if the url is different
        return item.isModified(this.paths.url);
    }

    /**
     * Field has no input and is always valid
     *
     * Deprecated
     */
    inputIsValid() {
        return true;
    }

    /**
     * Updates the value for this field in the item from a data object
     *
     * @api public
     */
    updateItem(item, data, callback) {
        // TODO: This could be more granular and check for actual changes to values,
        // see the Location field for an example

        // This field type is never editable, so to ensure that we don't inadvertently reset the fields on this item with a null value
        // A conditional has been added to negate updating this item should the fromPath on the passed in data object be the same as that on the item.
        if (data[this.fromPath] !== item[this.fromPath]) {
            item.set(item.set(this.path, {
                exists: data[this.paths.exists],
                type: data[this.paths.type],
                title: data[this.paths.title],
                url: data[this.paths.url],
                width: data[this.paths.width],
                height: data[this.paths.height],
                version: data[this.paths.version],
                description: data[this.paths.description],
                html: data[this.paths.html],
                authorName: data[this.paths.authorName],
                authorUrl: data[this.paths.authorUrl],
                providerName: data[this.paths.providerName],
                providerUrl: data[this.paths.providerUrl],
                thumbnailUrl: data[this.paths.thumbnailUrl],
                thumbnailWidth: data[this.paths.thumbnailWidth],
                thumbnailHeight: data[this.paths.thumbnailHeight],
            }));
        }
        process.nextTick(callback);
    }
}
