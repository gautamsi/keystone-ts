/**
 * Maps a built-in field (e.g. name) to a specific path
 */
export function map (field, path) {
	if (path) {
		this.mappings[field] = path;
	}
	return this.mappings[field];
}
