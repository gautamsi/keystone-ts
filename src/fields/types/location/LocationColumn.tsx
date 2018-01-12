import * as React from 'react';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

const SUB_FIELDS = ['street1', 'suburb', 'state', 'postcode', 'country'];

export interface Props {
    col?: any;
    data?: any;
}

export class LocationColumn extends React.Component<Props> {
    static displayName: string = 'LocationColumn';

    renderValue() {
        const value = this.props.data.fields[this.props.col.path];
        if (!value || !Object.keys(value).length) return null;

        const output = [];

        SUB_FIELDS.map((i) => {
            if (value[i]) {
                output.push(value[i]);
            }
        });
        return (
            <ItemsTableValue field={this.props.col.type} title={output.join(', ')}>
                {output.join(', ')}
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
