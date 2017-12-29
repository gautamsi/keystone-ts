import { add } from './add';
import { addFiltersToQuery } from './addFiltersToQuery';
import { addSearchToQuery } from './addSearchToQuery';
import { apiForGet } from './apiForGet';
import { automap } from './automap';
import { buildSearchTextIndex } from './buildSearchTextIndex';
import { declaresTextIndex } from './declaresTextIndex';
import { ensureTextIndex } from './ensureTextIndex';
import { expandColumns } from './expandColumns';
import { expandPaths } from './expandPaths';
import { expandSort } from './expandSort';
import { field } from './field';
import { getAdminURL } from './getAdminURL';
import { getCSVData } from './getCSVData';
import { getData } from './getData';
import { getDocumentName } from './getDocumentName';
import { getOptions } from './getOptions';
import { getPages } from './getPages';
import { getSearchFilters } from './getSearchFilters';
import { getUniqueValue } from './getUniqueValue';
import { isReserved } from './isReserved';
import { map } from './map';
import { paginate } from './paginate';
import { processFilters } from './processFilters';
import { register } from './register';
import { relationship } from './relationship';
import { selectColumns } from './selectColumns';
import { set } from './set';
import { underscoreMethod } from './underscoreMethod';
import { updateItem } from './updateItem';

export const listMethods = {
    add,
    addFiltersToQuery,
    addSearchToQuery,
    apiForGet,
    automap,
    buildSearchTextIndex,
    declaresTextIndex,
    ensureTextIndex,
    expandColumns,
    expandPaths,
    expandSort,
    field,
    getAdminURL,
    getCSVData,
    getData,
    getDocumentName,
    getOptions,
    getPages,
    getSearchFilters,
    getUniqueValue,
    isReserved,
    map,
    paginate,
    processFilters,
    register,
    relationship,
    selectColumns,
    set,
    underscoreMethod,
    updateItem
};
