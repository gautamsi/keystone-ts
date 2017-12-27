/**
 * Look for a text index defined in the current list schema; returns boolean
 * Note this doesn't check for text indexes that exist in the DB
 */

function declaresTextIndex () {
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

export default declaresTextIndex;
