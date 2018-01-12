import * as React from 'react';
import * as _ from 'lodash';

export interface Props {
    col?: any;
    data?: any;
}

export class EmbedlyColumn extends React.Component<Props> {
    renderValue() {
        let value = this.props.data.fields[this.props.col.path];
        if (!value || !_.size(value)) return;
        return <a href={value.url} target="_blank">{value.url}</a>;
    }
    render() {
        return (
            <td>
                <div className="ItemList__value">{this.renderValue()}</div>
            </td>
        );
    }
}
