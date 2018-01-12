import * as React from 'react';
import { Link } from 'react-router-dom';

export interface Props {
    count: string;
    hideCreateButton: boolean;
    href: string;
    label: string;
    path: string;
    spinner: React.ReactNode;
}

/**
 * Displays information about a list and lets you create a new one.
 */
export class ListTile extends React.Component<Props> {
    render() {
        let opts = {
            'data-list-path': this.props.path,
        };
        return (
            <div className="dashboard-group__list" {...opts}>
                <span className="dashboard-group__list-inner">
                    <Link to={this.props.href} className="dashboard-group__list-tile">
                        <div className="dashboard-group__list-label">{this.props.label}</div>
                        <div className="dashboard-group__list-count">{this.props.spinner || this.props.count}</div>
                    </Link>
                    {/* If we want to create a new list, we append ?create, which opens the
						create form on the new page! */}
                    {(!this.props.hideCreateButton) && (
                        <Link
                            to={this.props.href + '?create'}
                            className="dashboard-group__list-create octicon octicon-plus"
                            title="Create"
                            tabIndex={-1}
                        />
                    )}
                </span>
            </div>
        );
    }
}
