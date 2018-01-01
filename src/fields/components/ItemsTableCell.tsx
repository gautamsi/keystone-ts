import * as React from 'react';
import classnames from 'classnames';

export const ItemsTableCell: React.SFC<{ className?: any }> = ({ ...props }) => {
    props.className = classnames('ItemList__col', props.className);

    return <td {...props} />;
}
