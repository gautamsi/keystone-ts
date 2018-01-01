import * as React from 'react';
import { ItemsTableCell } from '../ItemsTableCell';
import { ItemsTableValue } from '../ItemsTableValue';

interface Props {
    col?: any;
    data?: any;
}

export class ArrayColumn extends React.Component<Props> {
    static displayName: string = 'ArrayColumn';
    renderValue() {
        const value = this.props.data.fields[this.props.col.path];
        if (!value || !value.length) return null;

        return value.join(', ');
    }
    render() {
        return (
            <ItemsTableCell>
                <ItemsTableValue field={this.props.col.type}>
                    {this.renderValue()}
                </ItemsTableValue>
            </ItemsTableCell>
        );
    }
}
