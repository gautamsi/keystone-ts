/**
 * Used by the Popout component and the Lightbox component of the fields for
 * popouts. Renders a non-react DOM node.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class Portal extends React.Component<{ className?: any }> {
    displayName: string = 'Portal';
    portalElement: HTMLElement = null;
    componentDidMount() {
        const el = document.createElement('div');
        document.body.appendChild(el);
        this.portalElement = el;
        this.componentDidUpdate();
    }
    componentWillUnmount() {
        document.body.removeChild(this.portalElement);
    }
    componentDidUpdate() {
        ReactDOM.render(<div {...this.props} />, this.portalElement);
    }
    getPortalDOMNode() {
        return this.portalElement;
    }
    render() {
        return null;
    }
}
