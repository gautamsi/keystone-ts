import * as React from 'react';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

export interface Props {
    col?: any;
    data?: any;
}

export class MarkdownColumn extends React.Component<Props> {
    static displayName: string = 'MarkdownColumn';

    renderValue() {
        const value = this.props.data.fields[this.props.col.path];
        return (value && Object.keys(value).length) ? value.md.substr(0, 100) : null;
    }
    render() {
        return (
            <ItemsTableCell>
                <ItemsTableValue field={this.props.col.type}>
                    {this.renderValue()}
                </ItemsTableValue>
            </ItemsTableCell>
        );
    }
}
