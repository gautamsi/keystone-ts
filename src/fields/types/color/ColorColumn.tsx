import * as React from 'react';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

export interface Props {
    col?: any;
    data?: any;
}

export class ColorColumn extends React.Component<Props> {
    static displayName: string = 'ColorColumn';
    renderValue() {
        const value = this.props.data.fields[this.props.col.path];
        if (!value) return null;

        const colorBoxStyle = {
            backgroundColor: value,
            borderRadius: 3,
            display: 'inline-block',
            height: 18,
            marginRight: 10,
            verticalAlign: 'middle',
            width: 18,
        };

        return (
            <ItemsTableValue truncate={false} field={this.props.col.type}>
                <div style={{ lineHeight: '18px' }}>
                    <span style={colorBoxStyle} />
                    <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{value}</span>
                </div>
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
