import * as React from 'react';
import numeral from 'numeral';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

interface Props {
    col?: any;
    data?: any;
}

export class NumberColumn extends React.Component<Props> {
    static displayName: string = 'NumberColumn';

    renderValue() {
        const value = this.props.data.fields[this.props.col.path];
        if (!value || isNaN(value)) return null;

        const formattedValue = (this.props.col.path === 'money') ? numeral(value).format('$0,0.00') : value;

        return formattedValue;
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
