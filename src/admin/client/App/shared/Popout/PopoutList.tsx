/**
 * Render a popout list. Can also use PopoutListItem and PopoutListHeading
 */

import * as React from 'react';
import * as blacklist from 'blacklist';
import * as classnames from 'classnames';

interface Props {
    children: React.ReactNode;
    className?: string;
}

export class PopoutList extends React.Component<Props> {
    static displayName: string = 'PopoutList';
    render() {
        const className = classnames('PopoutList', this.props.className);
        const props = blacklist(this.props, 'className');

        return (
            <div className={className} {...props} />
        );
    }
}

// expose the child to the top level export
import { PopoutListItem } from './PopoutListItem';
import { PopoutListHeading } from './PopoutListHeading';

export namespace PopoutList {
    export const Item = PopoutListItem;
    export const Heading = PopoutListHeading;
}
