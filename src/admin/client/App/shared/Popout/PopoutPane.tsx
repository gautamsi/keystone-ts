/**
 * Render a popout pane, calls props.onLayout when the component mounts
 */

import * as React from 'react';
import * as blacklist from 'blacklist';
import * as classnames from 'classnames';

interface Props {
    children: React.ReactNode;
    className?: string;
    onLayout?: any;
}
export class PopoutPane extends React.Component<Props> {

    refs: {
        [key: string]: (Element)
        el: (HTMLInputElement) // !important
    };
    static displayName: string = 'PopoutPane';
    getDefaultProps() {
        return {
            onLayout: () => { },
        };
    }
    componentDidMount() {
        this.props.onLayout(this.refs.el.offsetHeight);
    }
    render() {
        const className = classnames('Popout__pane', this.props.className);
        const props = blacklist(this.props, 'className', 'onLayout');

        return (
            <div ref="el" className={className} {...props} />
        );
    }
}
