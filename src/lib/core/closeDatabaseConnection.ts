import * as _debug from 'debug';
const debug = _debug('keystone:core:closeDatabaseConnection');

export function closeDatabaseConnection (callback) {
	this.mongoose.disconnect(function () {
		debug('mongo connection closed');
		callback && callback();
	});
	return this;
}
