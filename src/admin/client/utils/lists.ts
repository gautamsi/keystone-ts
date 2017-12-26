/**
 * Exports an object of lists, keyed with their key instead of their name and
 * wrapped with the List helper (./List.js)
 */

import List from "./List";

export let listsByKey = {};
export let listsByPath = {};

for (const key in Keystone.lists) {
    // Guard for-ins
    if ({}.hasOwnProperty.call(Keystone.lists, key)) {
        const list = new List(Keystone.lists[key]);
        listsByKey[key] = list;
        listsByPath[list.path] = list;
    }
}
