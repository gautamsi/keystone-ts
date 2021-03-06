import * as React from 'react';
import { CloudinaryImageSummary } from '../../components/columns/CloudinaryImageSummary';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

const moreIndicatorStyle = {
    color: '#888',
    fontSize: '.8rem',
};

export interface Props {
    col?: any;
    data?: any;
}

export class CloudinaryImagesColumn extends React.Component<Props> {
    static displayName: string = 'CloudinaryImagesColumn';
    renderMany(value) {
        if (!value || !value.length) return;
        const items = [];
        for (let i = 0; i < 3; i++) {
            if (!value[i]) break;
            items.push(<CloudinaryImageSummary key={'image' + i} image={value[i]} secure={this.props.col.field.secure} />);
        }
        if (value.length > 3) {
            items.push(<span key="more" style={moreIndicatorStyle}>[...{value.length - 3} more]</span>);
        }
        return items;
    }
    renderValue(value) {
        if (!value || !Object.keys(value).length) return;

        return <CloudinaryImageSummary image={value} secure={this.props.col.field.secure} />;

    }
    render() {
        const value = this.props.data.fields[this.props.col.path];
        const many = value.length > 1;

        return (
            <ItemsTableCell>
                <ItemsTableValue field={this.props.col.type}>
                    {many ? this.renderMany(value) : this.renderValue(value[0])}
                </ItemsTableValue>
            </ItemsTableCell>
        );
    }
}
