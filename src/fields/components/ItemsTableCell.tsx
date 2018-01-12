import * as React from 'react';
import * as classnames from 'classnames';

export const ItemsTableCell: React.SFC<{ className?: any, href?: any, padded?: any, interior?: any, field?: any }> = ({ ...props }) => {
    props.className = classnames('ItemList__col', props.className);

    return <td {...props} />;
};
