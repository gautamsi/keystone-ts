import { updateQueryParams, stringifyColumns, parametizeFilters, createSortQueryParams, createPageQueryParams } from '../../utils/queryParams';
import { replace, push } from 'react-router-redux';
import { select, put, call } from 'redux-saga/effects';
import * as blacklist from 'blacklist';

import * as actions from '../screens/List/constants';

import { loadItems } from '../screens/List/actions';

import * as _ from 'lodash';
import { columnsParser, sortParser, filtersParser } from '../parsers';

export function* urlUpdate(query, cache, pathname): any {
    const blacklistedField = 'search';
    const attenuatedQuery = blacklist(query, blacklistedField);
    const attenuatedCache = blacklist(cache, blacklistedField);
    if (!_.isEqual(attenuatedQuery, attenuatedCache)) {
        yield put(push({
            pathname,
            query,
        }));
    } else {
        yield put(replace({
            pathname,
            query,
        }));
    }
}
/**
 * Update the query params based on the current state
 */
export function* updateParams() {
    // Select all the things
    const activeState = yield select((state: any) => state.active);
    const currentList = yield select((state: any) => state.lists.currentList);
    const location = yield select((state: any) => state.routing.location);
    // const location = yield select((state: any) => state.routing.locationBeforeTransitions);
    const { index } = yield select((state: any) => state.lists.page);

    // Get the data into the right format, set the defaults
    const sort = createSortQueryParams(activeState.sort.rawInput, currentList.defaultSort);
    const page = createPageQueryParams(index, 1);

    const columns = stringifyColumns(activeState.columns, currentList.defaultColumnPaths);
    const search = activeState.search;

    const filters = parametizeFilters(activeState.filters);

    const newParams = updateQueryParams({
        page,
        columns,
        sort,
        search,
        filters,
    }, location);

    // TODO: Starting or clearing a search pushes a new history state, but updating
    // the current search replaces it for nicer history navigation support

    yield put({ type: actions.REPLACE_CACHED_QUERY, cachedQuery: newParams });
    yield* urlUpdate(newParams, activeState.cachedQuery, location.pathname);
    yield put(<any>loadItems());
}


export function* evalQueryParams(): any {
    const { pathname, query } = yield select((state: any) => state.routing.location);

    const { cachedQuery } = yield select((state: any) => state.active);
    const { currentList } = yield select((state: any) => state.lists);

    // if (pathname !== `/keystone/${currentList.id}`) return;
    if (pathname !== `${Keystone.adminPath}/${currentList.id}`) return;

    if (_.isEqual(query, cachedQuery)) {
        yield put({ type: actions.QUERY_HAS_NOT_CHANGED });
        yield put(<any>loadItems());
    } else {
        const parsedQuery = yield call(parseQueryParams, query || {}, currentList);
        yield put({ type: actions.QUERY_HAS_CHANGED, parsedQuery });
    }
}

export function parseQueryParams(query, currentList) {
    const columns = columnsParser(query.columns, currentList);
    const sort = sortParser(query.sort, currentList);
    const filters = filtersParser(query.filters, currentList);
    const currentPage = query.page || 1;
    const search = query.search || '';

    return {
        columns,
        sort,
        filters,
        currentPage,
        search,
    };
}
