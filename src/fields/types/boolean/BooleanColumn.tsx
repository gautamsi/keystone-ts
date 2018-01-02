import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

interface Props {
    col?: any;
    data?: any;
}

export class BooleanColumn extends React.Component<Props, any> {
    static displayName: string = 'BooleanColumn';
    renderValue() {
        return (
            <ItemsTableValue truncate={false} field={this.props.col.type}>
                <Checkbox readonly checked={this.props.data.fields[this.props.col.path]} />
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
