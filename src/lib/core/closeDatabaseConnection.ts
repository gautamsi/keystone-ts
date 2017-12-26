var debug = require('debug')('keystone:core:closeDatabaseConnection');

export default function closeDatabaseConnection (callback) {
	this.mongoose.disconnect(function () {
		debug('mongo connection closed');
		callback && callback();
	});
	return this;
};
