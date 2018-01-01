import { css } from 'glamor';
import * as React from 'react';
import { theme } from '../../../../theme';

import { ListSort } from './ListSort';

export function ListHeaderTitle({
	activeSort,
    availableColumns,
    handleSortSelect,
    title,
    ...props
}) {
    return (
        <h2 className={`${css(classes.heading)}`} {...props}>
            {title}
            <ListSort
                activeSort={activeSort}
                availableColumns={availableColumns}
                handleSortSelect={handleSortSelect}
            />
        </h2>
    );
}

interface Props {
    activeSort?: object;
    availableColumns?: Array<any>;
    handleSortSelect: any;
    title?: string;
}

const classes = {
    heading: {
        [`@media (max-width: ${theme.breakpoint.mobileMax})`]: {
            fontSize: '1.25em',
            fontWeight: 500,
        },
    },
};
