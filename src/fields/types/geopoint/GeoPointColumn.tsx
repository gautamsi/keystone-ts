import * as React from 'react';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

interface Props {
    col?: any;
    data?: any;
}

export class GeoPointColumn extends React.Component<Props> {
    static displayName: string = 'GeoPointColumn';

    renderValue() {
        const value = this.props.data.fields[this.props.col.path];
        if (!value || !value.length) return null;

        const formattedValue = `${value[1]}, ${value[0]}`;
        const formattedTitle = `Lat: ${value[1]} Lng: ${value[0]}`;

        return (
            <ItemsTableValue title={formattedTitle} field={this.props.col.type}>
                {formattedValue}
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
