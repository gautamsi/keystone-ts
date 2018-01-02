import * as React from 'react';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

interface Props {
    col?: any;
    data?: any;
}

export class EmailColumn extends React.Component<Props> {
    static displayName: string = 'EmailColumn';

    renderValue() {
        const value = this.props.data.fields[this.props.col.path];
        if (!value) return;

        return (
            <ItemsTableValue to={'mailto:' + value} padded exterior field={this.props.col.type}>
                {value}
            </ItemsTableValue>
        );
    }
    render() {
        return (
            <ItemsTableCell>
                {this.renderValue()}
            </ItemsTableCell>
        );
    }
}
