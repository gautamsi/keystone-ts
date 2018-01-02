import * as React from 'react';
import { ItemsTableCell } from '../../components/ItemsTableCell';
import { ItemsTableValue } from '../../components/ItemsTableValue';

interface Props {
    col?: any;
    data?: any;
}

export class UrlColumn extends React.Component<Props> {
    static displayName: string = 'UrlColumn';

    renderValue() {
        let value = this.props.data.fields[this.props.col.path];
        if (!value) return;

        // if the value doesn't start with a prototcol, assume http for the href
        let href = value;
        if (href && !/^(mailto\:)|(\w+\:\/\/)/.test(href)) {
            href = 'http://' + value;
        }

        // strip the protocol from the link if it's http(s)
        let label = value.replace(/^https?\:\/\//i, '');

        return (
            <ItemsTableValue to={href} padded exterior field={this.props.col.type}>
                {label}
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
