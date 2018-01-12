import * as React from 'react';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

export interface Props {
    col?: any;
    data?: any;
    linkTo?: string;
}

export class TextColumn extends React.Component<Props> {
    static displayName: string = 'TextColumn';

    getValue() {
        // cropping text is important for textarea, which uses this column
        const value = this.props.data.fields[this.props.col.path];
        return value ? value.substr(0, 100) : null;
    }
    render() {
        const value = this.getValue();
        const empty = !value && this.props.linkTo ? true : false;
        const className = this.props.col.field.monospace ? 'ItemList__value--monospace' : undefined;
        return (
            <ItemsTableCell>
                <ItemsTableValue className={className} to={this.props.linkTo} empty={empty} padded interior field={this.props.col.type}>
                    {value}
                </ItemsTableValue>
            </ItemsTableCell>
        );
    }
}
