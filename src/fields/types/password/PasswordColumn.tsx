import * as React from 'react';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

export const PasswordColumn = React.createClass({
    displayName: 'PasswordColumn',
    propTypes: {
        col: React.PropTypes.object,
        data: React.PropTypes.object,
    },
    renderValue() {
        const value = this.props.data.fields[this.props.col.path];
        return value ? '********' : '';
    },
    render() {
        return (
            <ItemsTableCell>
                <ItemsTableValue field={this.props.col.type}>
                    {this.renderValue()}
                </ItemsTableValue>
            </ItemsTableCell>
        );
    },
});
