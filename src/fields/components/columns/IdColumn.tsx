import * as React from 'react';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

interface Props {
    col?: any;
    data?: any;
    list?: any;
}

export class IdColumn extends React.Component<Props> {
    static displayName: string = 'IdColumn';
    renderValue() {
        const value = this.props.data.id;
        if (!value) return null;

        return (
            <ItemsTableValue padded interior title={value} to={Keystone.adminPath + '/' + this.props.list.path + '/' + value} field={this.props.col.type}>
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
