import * as React from 'react';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

interface Props {
    col?: any;
}

export class InvalidColumn extends React.Component<Props> {
    static displayName: string = 'InvalidColumn';
    renderValue() {
        return (
            <ItemsTableValue field={this.props.col.type}>
                (Invalid Type: {this.props.col.type})
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
