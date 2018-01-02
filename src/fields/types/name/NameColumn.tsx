import * as React from 'react';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';
import displayName from 'display-name';

interface Props {
    col?: any;
    data?: any;
    linkTo?: string;
}

export class NameColumn extends React.Component<Props> {
    static displayName: string = 'NameColumn';

    renderValue() {
        let value = this.props.data.fields[this.props.col.path];
        if (!value || (!value.first && !value.last)) return '(no name)';
        return displayName(value.first, value.last);
    }
    render() {
        return (
            <ItemsTableCell>
                <ItemsTableValue to={this.props.linkTo} padded interior field={this.props.col.type}>
                    {this.renderValue()}
                </ItemsTableValue>
            </ItemsTableCell>
        );
    }
}
