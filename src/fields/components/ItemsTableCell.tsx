import * as React from 'react';
import classnames from 'classnames';

export function ItemsTableCell ({ className, ...props }) {
	props.className = classnames('ItemList__col', className);

	return <td {...props} />;
}
