import * as _ from 'lodash';
import * as assign from 'object-assign';
import * as async from 'async';
import { FieldTypeBase } from '../FieldTypeBase';
import { keystone } from '../../../keystone';

function getEmptyValue() {
    return {
        public_id: '',
        version: 0,
        signature: '',
        format: '',
        resource_type: '',
        url: '',
        width: 0,
        height: 0,
        secure_url: '',
    };
}

function truthy(value) {
    return value;
}

/**
 * CloudinaryImages FieldType Constructor
 */
export class CloudinaryImagesType extends FieldTypeBase {
    paths: { folder: string; upload: string; uploads: string; action: string; };

    constructor(list, path, options) {
        super(list, path, options);
        this._underscoreMethods = ['format'];
        this._fixedSize = 'full';
        this._properties = ['select', 'selectPrefix', 'autoCleanup', 'publicID', 'folder', 'filenameAsPublicID'];


        // validate cloudinary config
        if (!keystone.get('cloudinary config')) {
            throw new Error('Invalid Configuration\n\n'
                + 'CloudinaryImages fields (' + list.key + '.' + this.path + ') require the "cloudinary config" option to be set.\n\n'
                + 'See http://keystonejs.com/docs/configuration/#services-cloudinary for more information.\n');
        }
    }
    static properName = 'CloudinaryImagesType';

    /**
     * Gets the folder for images in this field
     */
    getFolder() {
        let folder = null;

        if (keystone.get('cloudinary folders') || this.options.folder) {
            if (typeof this.options.folder === 'string') {
                folder = this.options.folder;
            } else {
                folder = this.list.path + '/' + this.path;
            }
        }

        return folder;
    }

    /**
     * Registers the field on the List's Mongoose Schema.
     */
    addToSchema(schema) {

        const cloudinary = require('cloudinary');
        const mongoose = keystone.mongoose;
        const field = this;

        this.paths = {
            // virtuals
            folder: this.path + '.folder',
            // form paths
            upload: this.path + '_upload',
            uploads: this.path + '_uploads',
            action: this.path + '_action',
        };

        const ImageSchema = new mongoose.Schema({
            public_id: String,
            version: Number,
            signature: String,
            format: String,
            resource_type: String,
            url: String,
            width: Number,
            height: Number,
            secure_url: String,
        });

        // Generate cloudinary folder used to upload/select images
        const folder = function (item) { // eslint-disable-line no-unused-vars
            let folderValue = '';

            if (keystone.get('cloudinary folders')) {
                if (field.options.folder) {
                    folderValue = field.options.folder;
                } else {
                    const folderList = keystone.get('cloudinary prefix') ? [keystone.get('cloudinary prefix')] : [];
                    folderList.push(field.list.path);
                    folderList.push(field.path);
                    folderValue = folderList.join('/');
                }
            }

            return folderValue;
        };

        // The .folder virtual returns the cloudinary folder used to upload/select images
        schema.virtual(field.paths.folder).get(function () {
            return folder(this);
        });

        const src = function (img, options) {
            if (keystone.get('cloudinary secure')) {
                options = options || {};
                options.secure = true;
            }
            options.format = options.format || img.format;
            return img.public_id ? cloudinary.url(img.public_id, options) : '';
        };

        const addSize = function (options, width, height, other) {
            if (width) options.width = width;
            if (height) options.height = height;
            if (typeof other === 'object') {
                assign(options, other);
            }
            return options;
        };
        ImageSchema.method('src', function (options) {
            return src(this, options);
        });
        ImageSchema.method('scale', function (width, height, options) {
            return src(this, addSize({ crop: 'scale' }, width, height, options));
        });
        ImageSchema.method('fill', function (width, height, options) {
            return src(this, addSize({ crop: 'fill', gravity: 'faces' }, width, height, options));
        });
        ImageSchema.method('lfill', function (width, height, options) {
            return src(this, addSize({ crop: 'lfill', gravity: 'faces' }, width, height, options));
        });
        ImageSchema.method('fit', function (width, height, options) {
            return src(this, addSize({ crop: 'fit' }, width, height, options));
        });
        ImageSchema.method('limit', function (width, height, options) {
            return src(this, addSize({ crop: 'limit' }, width, height, options));
        });
        ImageSchema.method('pad', function (width, height, options) {
            return src(this, addSize({ crop: 'pad' }, width, height, options));
        });
        ImageSchema.method('lpad', function (width, height, options) {
            return src(this, addSize({ crop: 'lpad' }, width, height, options));
        });
        ImageSchema.method('crop', function (width, height, options) {
            return src(this, addSize({ crop: 'crop', gravity: 'faces' }, width, height, options));
        });
        ImageSchema.method('thumbnail', function (width, height, options) {
            return src(this, addSize({ crop: 'thumb', gravity: 'faces' }, width, height, options));
        });

        schema.add(this._path.addTo({}, [ImageSchema]));

        this.removeImage = function (item, id, method, callback) {
            const images = item.get(field.path);
            if (typeof id !== 'number') {
                for (let i = 0; i < images.length; i++) {
                    if (images[i].public_id === id) {
                        id = i;
                        break;
                    }
                }
            }
            const img = images[id];
            if (!img) return;
            if (method === 'delete') {
                cloudinary.uploader.destroy(img.public_id, function () { });
            }
            images.splice(id, 1);
            if (callback) {
                item.save((typeof callback !== 'function') ? callback : undefined);
            }
        };
        this.underscoreMethod('remove', function (id, callback) {
            field.removeImage(this, id, 'remove', callback);
        });
        this.underscoreMethod('delete', function (id, callback) {
            field.removeImage(this, id, 'delete', callback);
        });
        this.bindUnderscoreMethods();
    }

    removeImage(item, id, method, callback) { }

    /**
     * Formats the field value
     */
    format(item) {
        return _.map(item.get(this.path), (img: any) => {
            return img.src();
        }).join(', ');
    }

    /**
     * Gets the field's data from an Item, as used by the React components
     */
    getData(item) {
        const value = item.get(this.path);
        return Array.isArray(value) ? value : [];
    }

    /**
     * Validates that a value for this field has been provided in a data object
     *
     * Deprecated
     */
    inputIsValid(data) { // eslint-disable-line no-unused-vars
        // TODO - how should image field input be validated?
        return true;
    }


    _originalGetOptions() {
        return this.getOptions();
    }

    getOptions() {
        this._originalGetOptions();
        // We are performing the check here, so that if cloudinary secure is added
        // to keystone after the model is registered, it will still be respected.
        // Setting secure overrides default `cloudinary secure`
        if ('secure' in this.options) {
            this.__options.secure = this.options.secure;
        } else if (keystone.get('cloudinary secure')) {
            this.__options.secure = keystone.get('cloudinary secure');
        }
        return this.__options;
    }

    /**
     * Updates the value for this field in the item from a data object
     */
    updateItem(item, data, files, callback) {
        if (typeof files === 'function') {
            callback = files;
            files = {};
        } else if (!files) {
            files = {};
        }

        const cloudinary = require('cloudinary');
        const field = this;
        let values = this.getValueFromData(data);

        // TODO: This logic needs to block uploading of files from the data argument,
        // see CloudinaryImage for a reference on how it should be implemented

        // Early exit path: reset value when falsy, or bail if no value was provided
        if (!values) {
            if (values !== undefined) {
                item.set(field.path, []);
            }
            return process.nextTick(callback);
        }

        // When the value exists, but isn't an array, turn it into one (this just
        // means a single field was submitted in the formdata)
        if (!Array.isArray(values)) {
            values = [values];
        }

        // We cache options to avoid recalculating them on each iteration in the map below
        let cachedUploadOptions;
        function getUploadOptions() {
            if (cachedUploadOptions) {
                return cachedUploadOptions;
            }
            let tagPrefix = keystone.get('cloudinary prefix') || '';
            const uploadOptions = {
                tags: [],
                folder: undefined
            };
            if (tagPrefix.length) {
                uploadOptions.tags.push(tagPrefix);
                tagPrefix += '_';
            }
            uploadOptions.tags.push(tagPrefix + field.list.path + '_' + field.path);
            if (keystone.get('env') !== 'production') {
                uploadOptions.tags.push(tagPrefix + 'dev');
            }
            const folder = field.getFolder();
            if (folder) {
                uploadOptions.folder = folder;
            }
            cachedUploadOptions = uploadOptions;
            return uploadOptions;
        }

        // Preprocess values to deserialise JSON, detect mappings to uploaded files
        // and flatten out arrays
        values = values.map(function (value) {
            // When the value is a string, it may be JSON serialised data.
            if (typeof value === 'string'
                && value.charAt(0) === '{'
                && value.charAt(value.length - 1) === '}'
            ) {
                try {
                    return JSON.parse(value);
                } catch (e) { /* value isn't JSON */ }
            }
            if (typeof value === 'string') {
                // detect file upload (field value must be a reference to a field in the
                // uploaded files object provided by multer)
                if (value.substr(0, 7) === 'upload:') {
                    const uploadFieldPath = value.substr(7);
                    return files[uploadFieldPath];
                }
                // detect a URL or Base64 Data
                else if (/^(data:[a-z\/]+;base64)|(https?\:\/\/)/.test(value)) {
                    return { path: value };
                }
            }
            return value;
        });
        values = _.flatten(values);

        async.map(values, function (value: any, next) {
            if (typeof value === 'object' && 'public_id' in value) {
                // Cloudinary Image data provided
                if (value.public_id) {
                    // Default the object with empty values
                    const v = assign(getEmptyValue(), value);
                    return next(null, v);
                } else {
                    // public_id is falsy, remove the value
                    return next();
                }
            } else if (typeof value === 'object' && value.path) {
                // File provided - upload it
                let uploadOptions = getUploadOptions();
                // NOTE: field.options.publicID has been deprecated (tbc)
                if (field.options.filenameAsPublicID && value.originalname && typeof value.originalname === 'string') {
                    uploadOptions = assign({}, uploadOptions, {
                        public_id: value.originalname.substring(0, value.originalname.lastIndexOf('.')),
                    });
                }
                // TODO: implement autoCleanup; should delete existing images before uploading
                cloudinary.uploader.upload(value.path, function (result) {
                    if (result.error) {
                        next(result.error);
                    } else {
                        next(null, result);
                    }
                }, uploadOptions);
            } else {
                // Nothing to do
                // TODO: We should really also support deleting images from cloudinary,
                // see the CloudinaryImageType field for reference
                return next();
            }
        }, function (err, result) {
            if (err) return callback(err);
            result = result.filter(truthy);
            item.set(field.path, result);
            return callback();
        });
    }
}
