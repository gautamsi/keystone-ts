import * as React from 'react';
import * as PropTypes from 'prop-types';

// Pass the Lightbox context through to the Portal's descendents
// StackOverflow discussion http://goo.gl/oclrJ9

export class PassContext extends React.Component<Props> {
    static childContextTypes = {
        onClose: PropTypes.func,
    };
    getChildContext() {
        return this.props.context;
    }
    render() {
        return React.Children.only(this.props.children);
    }
}

export interface Props {
    context: any;
}
