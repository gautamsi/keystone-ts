/**
 * Render a few flash messages, e.g. errors, success messages, warnings,...
 *
 * Use like this:
 * <FlashMessages
 *   messages={{
 *	   error: [{
 *	     title: 'There is a network problem',
 *	     detail: 'Please try again later...',
 *	   }],
 *   }}
 * />
 *
 * Instead of error, it can also be hilight, info, success or warning
 */

import * as React from 'react';
import * as _ from 'lodash';

import { FlashMessage } from './FlashMessage';

interface Props {
    messages?: boolean | {
        error?: Array<any>;
        hilight?: Array<any>;
        info?: Array<any>;
        success?: Array<any>;
        warning?: Array<any>;
    };
}

export class FlashMessages extends React.Component<Props> {
    static displayName: string = 'FlashMessages';
    // Render messages by their type
    renderMessages(messages, type) {
        if (!messages || !messages.length) return null;

        return messages.map((message, i) => {
            return <FlashMessage message={message} type={type} key={`i${i}`} />;
        });
    }
    // Render the individual messages based on their type
    renderTypes(types) {
        return Object.keys(types).map(type => this.renderMessages(types[type], type));
    }
    render() {
        if (!this.props.messages) return null;

        return (
            <div className="flash-messages">
                {_.isPlainObject(this.props.messages) && this.renderTypes(this.props.messages)}
            </div>
        );
    }
}
