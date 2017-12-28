import * as _ from 'lodash';

/**
 * Retrieves orphaned lists (those not in a nav section)
 */

export function getOrphanedLists() {
    if (!this.nav) {
        return [];
    }
    return _.filter(this.lists, function (list, key) {
        if (list.get('hidden')) return false;
        return (!this.nav.by.list[key]) ? list : false;
    }.bind(this));
}
