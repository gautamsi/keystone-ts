import * as _ from 'lodash';

import {
    ADD_FILTER,
    CLEAR_FILTER,
    CLEAR_ALL_FILTERS,
    SET_ACTIVE_SEARCH,
    SET_ACTIVE_SORT,
    SET_ACTIVE_COLUMNS,
    SET_ACTIVE_LIST,
    SET_FILTERS,
    QUERY_HAS_CHANGED,
    REPLACE_CACHED_QUERY,
    CLEAR_CACHED_QUERY,
} from '../constants';

const initialState = {
    columns: [],
    filters: [],
    search: '',
    sort: {
        input: '',
        isDefaultSort: false,
        paths: [],
        rawInput: '',
    },
    cachedQuery: {},
};

/**
 * Manage the active state
 */
export function activeReducer(state: any = initialState, action: any = {}) {
    switch (action.type) {
        case SET_ACTIVE_LIST:
            return Object.assign({}, state, {
                id: action.id,
                columns: action.list.expandColumns(action.list.defaultColumns),
                filters: [],
                search: '',
                sort: action.list.expandSort(action.list.defaultSort),
            });
        case SET_ACTIVE_SEARCH:
            return Object.assign({}, state, {
                search: action.searchString,
            });
        case SET_ACTIVE_SORT:
            return Object.assign({}, state, {
                sort: action.sort,
            });
        case SET_ACTIVE_COLUMNS:
            return Object.assign({}, state, {
                columns: action.columns,
            });
        case ADD_FILTER:
            return Object.assign({}, state, {
                // Override existing filter with field path,
                // otherwise add to filters array
                filters: _.unionWith([action.filter], state.filters, (stateFilter, actionFilter) => {
                    return stateFilter.field.path === actionFilter.field.path;
                }),
            });
        case SET_FILTERS:
            return Object.assign({}, state, {
                filters: action.filters,
            });
        case CLEAR_FILTER:
            const newFilters = _.filter(state.filters, (filter) => {
                return filter.field.path !== action.path;
            });
            return Object.assign({}, state, {
                filters: newFilters,
            });
        case CLEAR_ALL_FILTERS:
            return Object.assign({}, state, {
                filters: [],
            });
        case QUERY_HAS_CHANGED:
            const {
				search,
                sort,
                filters,
                columns,
			} = action.parsedQuery;

            return Object.assign({}, state, {
                search,
                sort: sort || initialState.sort,
                filters: filters || initialState.filters,
                columns: columns || initialState.columns,
            });
        case REPLACE_CACHED_QUERY:
            return Object.assign({}, state, {
                cachedQuery: action.cachedQuery,
            });
        case CLEAR_CACHED_QUERY:
            return Object.assign({}, state, {
                cachedQuery: {},
            });
        default:
            return state;
    }
}
