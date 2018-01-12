import * as React from 'react';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

export interface Props {
    col?: any;
    data?: any;
    linkTo?: string;
}

export class SelectColumn extends React.Component<Props> {
    static displayName: string = 'SelectColumn';

    getValue() {
        const value = this.props.data.fields[this.props.col.path];
        const option = this.props.col.field.ops.filter(i => i.value === value)[0];

        return option ? option.label : null;
    }
    render() {
        const value = this.getValue();
        const empty = !value && this.props.linkTo ? true : false;
        return (
            <ItemsTableCell>
                <ItemsTableValue field={this.props.col.type} to={this.props.linkTo} empty={empty}>
                    {value}
                </ItemsTableValue>
            </ItemsTableCell>
        );
    }
}
