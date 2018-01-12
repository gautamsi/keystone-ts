import * as React from 'react';

import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

export interface Props {
    col?: any;
    data?: any;
}

export class LocalFileColumn extends React.Component<Props> {
    renderValue() {
        let value = this.props.data.fields[this.props.col.path];
        if (!value || !value.filename) return;
        return value.filename;
    }
    render() {
        let value = this.props.data.fields[this.props.col.path];
        let href = value && value.url ? value.url : null;
        let label = value && value.filename ? value.filename : null;
        return (
            <ItemsTableCell href={href} padded interior field={this.props.col.type}>
                <ItemsTableValue>{label}</ItemsTableValue>
            </ItemsTableCell>
        );
    }
}
