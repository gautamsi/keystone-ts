const assign = require('object-assign');
const ensureCallback = require('keystone-storage-namefunctions/ensureCallback');
const fs = require('fs-extra');
const nameFunctions = require('keystone-storage-namefunctions');
const path = require('path');
const prototypeMethods = require('keystone-storage-namefunctions/prototypeMethods');
const sanitize = require('sanitize-filename');
const url = require('url');

const debug = require('debug')('keystone:storage:adapter:fs');

const DEFAULT_OPTIONS = {
	generateFilename: nameFunctions.randomFilename,
	whenExists: 'retry',
	retryAttempts: 3, // For whenExists: 'retry'.
};

function ensurePath (path) {
	// Ensure that the specified path exists and is writable. This is quick and
	// happens on server startup, so sync functions are ok.
	try {
		// accessSync throws if the item doesn't exist or we don't have
		// permission to read + write it.
		fs.accessSync(path, fs.R_OK | fs.W_OK);

		if (!fs.statSync(path).isDirectory()) {
			throw Error('Specified output path is not a directory');
		}
	} catch (e) {
		if (e.code === 'ENOENT') {
			// Recover by creating the directory.
			fs.mkdirsSync(path);
			debug("Storage output path '" + path + "' created");
			return;
		}
		throw e;
	}
}

function FSAdapter (options, schema) {
	if (!schema.filename) throw Error('Cannot use FSAdapter without storing filename');

	this.options = assign({}, DEFAULT_OPTIONS, options.fs);
	debug('Initialising FS Adapter with options', this.options);

	this.options.generateFilename = ensureCallback(this.options.generateFilename);
	ensurePath(this.options.path);
}

FSAdapter.compatibilityLevel = 1;

// All the extra schema fields supported by this adapter.
FSAdapter.SCHEMA_TYPES = {
	// This adapter stores its key in the name of a file on disk.
	filename: String,
};

FSAdapter.SCHEMA_FIELD_DEFAULTS = {
	filename: true,
};

/**
	Inherit common prototype behaviours for generating and retrying filenames
	from the keystone-storage-namefunctions package
*/
FSAdapter.prototype.getFilename = prototypeMethods.getFilename;
FSAdapter.prototype.retryFilename = prototypeMethods.retryFilename;

/**
	Gets the public path of a stored file by combining the publicPath option
	with the filename in the field value
*/
FSAdapter.prototype.getFileURL = function (file) {
	const publicPath = this.options.publicPath;
	if (!publicPath) return null; // No URL.

	return url.resolve(publicPath, file.filename);
};

/**
	Private function for getting the on-disk filename
*/
FSAdapter.prototype.pathForFile = function (filename) {
	return path.resolve(this.options.path, sanitize(filename));
};

/**
	Uploads a file at the specified path and returns the value to be stored
	in the field value. The file argument must be an object as per the [multer
	file information spec](https://github.com/expressjs/multer#file-information)
*/
FSAdapter.prototype.uploadFile = function (file, callback) {
	debug('Uploading file', file);
	const options = this.options;
	this.getFilename(file, function (err, filename) {
		if (err) return callback(err);
		filename = sanitize(filename);
		debug('Uploading file with filename: %s', filename);
		const uploadPath = path.resolve(options.path, filename);
		const fsOptions = {};
		fsOptions.clobber = options.whenExists === 'overwrite';
		fs.move(file.path, uploadPath, fsOptions, function (err) {
			if (err) return callback(err);

			// TODO: Chmod the file.

			const data = {
				filename: filename,
				size: file.size,
				mimetype: file.mimetype,
				path: options.path,
				originalname: file.originalname,
			};
			debug('Uploaded file, returning data', data);
			callback(null, data);
		});
	});
};

FSAdapter.prototype.removeFile = function (file, callback) {
	debug('Removing file', file);
	fs.unlink(this.pathForFile(file.filename), function (err) {
		if (err && err.code === 'ENOENT') {
			// The file doesn't exist.
			console.warn('Attempted to remove a non-existant file');
			return callback();
		}

		callback(err);
	});
};

FSAdapter.prototype.fileExists = function (filename, callback) {
	const path = this.pathForFile(filename);
	debug('Checking for file at path %s', filename);
	// Returns (err, bool) to the callback based on whether or not the file
	// already exists. Used if whenExists: 'error' or 'retry' in the options
	fs.stat(path, function (err, stats) {
		if (err && err.code === 'ENOENT') {
			// File does not exist
			callback(null, false);
		} else if (err) {
			// Other error getting file info
			callback(err);
		} else if (stats.isFile()) {
			// File does exist
			callback(null, true);
		} else {
			// Object at path is not a file
			callback(Error('Invalid save destination - dest is not a file'));
		}
	});
};

export = FSAdapter;
