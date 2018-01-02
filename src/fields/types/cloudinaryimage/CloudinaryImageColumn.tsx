import * as React from 'react';
import { CloudinaryImageSummary } from '../../components/columns/CloudinaryImageSummary';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

interface Props {
    col?: any;
    data?: any;
}

export class CloudinaryImageColumn extends React.Component<Props> {
    static displayName: string = 'CloudinaryImageColumn';
    renderValue() {
        let value = this.props.data.fields[this.props.col.path];
        if (!value || !Object.keys(value).length) return;

        return (
            <ItemsTableValue field={this.props.col.type} >
                <CloudinaryImageSummary label="dimensions" image={value} secure={this.props.col.field.secure} />
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

