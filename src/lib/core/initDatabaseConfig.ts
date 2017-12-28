import * as utils from 'keystone-utils';

export function initDatabaseConfig () {
	if (!this.get('mongo')) {
		const dbName = this.get('db name')
			|| utils.slug(this.get('name'));
		const dbUrl = process.env.MONGO_URI
			|| process.env.MONGODB_URI
			|| process.env.MONGO_URL
			|| process.env.MONGODB_URL
			|| process.env.MONGOLAB_URI
			|| process.env.MONGOLAB_URL
			|| (process.env.OPENSHIFT_MONGODB_DB_URL
			|| 'mongodb://localhost/') + dbName;
		this.set('mongo', dbUrl);
	}
	return this;
}
