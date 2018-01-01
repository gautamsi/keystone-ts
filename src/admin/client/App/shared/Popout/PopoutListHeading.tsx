/**
 * Render a popout list heading
 */

import * as React from 'react';
import * as blacklist from 'blacklist';
import * as classnames from 'classnames';

interface Props {
    children: React.ReactNode;
    className?: string;
}

export class PopoutListHeading extends React.Component<Props> {
    static displayName: string = 'PopoutListHeading';
    render() {
        const className = classnames('PopoutList__heading', this.props.className);
        const props = blacklist(this.props, 'className');

        return (
            <div className={className} {...props} />
        );
    }
}
