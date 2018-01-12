import * as React from 'react';
import * as moment from 'moment';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

export interface Props {
    col?: any;
    data?: any;
    linkTo?: string;
}

export class DateColumn extends React.Component<Props> {
    static displayName: string = 'DateColumn';

    getValue() {
        const value = this.props.data.fields[this.props.col.path];
        if (!value) return null;

        const format = (this.props.col.type === 'datetime') ? 'MMMM Do YYYY, h:mm:ss a' : 'MMMM Do YYYY';
        return moment(value).format(format);
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
