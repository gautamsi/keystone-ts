/**
 * A navigation item of the secondary navigation
 */

import * as React from 'react';
import { Link } from 'react-router';

interface Props {
    children: React.ReactNode;
    className?: string;
    href: string;
    onClick?: any;
    path?: string;
    title?: string;
}
export class SecondaryNavItem extends React.Component<Props> {
    static displayName: string = 'SecondaryNavItem';

    render() {
        return (
            <li className={this.props.className} data-list-path={this.props.path}>
                <Link
                    to={this.props.href}
                    onClick={this.props.onClick}
                    title={this.props.title}
                    tabIndex={-1}
                >
                    {this.props.children}
                </Link>
            </li>
        );
    }
}
