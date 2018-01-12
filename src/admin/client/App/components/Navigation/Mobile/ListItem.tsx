/**
 * A list item of the mobile navigation
 */

import * as React from 'react';
import { Link } from 'react-router-dom';

export interface Props {
    children: React.ReactNode;
    className?: string;
    href: string;
    onClick?: any;
}
export class MobileListItem extends React.Component<Props, any> {
    static displayName: string = 'MobileListItem';

    render() {
        return (
            <Link
                className={this.props.className}
                to={this.props.href}
                onClick={this.props.onClick}
                tabIndex={-1}
            >
                {this.props.children}
            </Link>
        );
    }
}
