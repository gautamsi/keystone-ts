import * as React from 'react';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

interface Props {
    col?: any;
    data?: any;
}

export class PasswordColumn extends React.Component<Props> {
    static displayName: string = 'PasswordColumn';

    renderValue() {
        const value = this.props.data.fields[this.props.col.path];
        return value ? '********' : '';
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
