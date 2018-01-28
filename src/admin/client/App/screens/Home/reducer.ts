import {
    LOAD_COUNTS,
    COUNTS_LOADING_SUCCESS,
    COUNTS_LOADING_ERROR,
} from './constants';

const initialState = {
    counts: {},
    loading: false,
    error: null,
};

export function homeReducer(state: any = initialState, action: any = {}) {
    switch (action.type) {
        case LOAD_COUNTS:
            return Object.assign({}, state, {
                loading: true,
            });
        case COUNTS_LOADING_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                counts: action.counts,
                error: null,
            });
        case COUNTS_LOADING_ERROR:
            return Object.assign({}, state, {
                loading: false,
                error: action.error,
            });
        default:
            return state;
    }
}
