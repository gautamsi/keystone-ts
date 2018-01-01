/**
 * Render the body of a popout
 */

import * as React from 'react';
import * as blacklist from 'blacklist';
import * as classnames from 'classnames';

interface Props {

    children: Element;
    className?: string;
    scrollable?: boolean;

}
export class PopoutBody extends React.Component<any, any> {
    displayName: 'PopoutBody';

    render() {
        const className = classnames('Popout__body', {
            'Popout__scrollable-area': this.props.scrollable,
        }, this.props.className);
        const props = blacklist(this.props, 'className', 'scrollable');

        return (
            <div className={className} {...props} />
        );
    }
}
