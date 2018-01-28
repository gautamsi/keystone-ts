/**
 * A single flash message component. Used by FlashMessages.js
 */

import * as React from 'react';
import { Alert } from '../elemental';

export interface Props {
    message: string | any;
    type?: 'danger' | 'error' | 'info' | 'success' | 'warning';
}

export class FlashMessage extends React.Component<Props> {
    // Render the message
    renderMessage(message) {
        // If the message is only a string, render the string
        if (typeof message === 'string') {
            return (
                <span>
                    {message}
                </span>
            );
        }

        // Get the title and the detail of the message
        const title = message.title ? <h4>{message.title}</h4> : null;
        const detail = message.detail ? <p>{message.detail}</p> : null;
        // If the message has a list attached, render a <ul>
        const list = message.list ? (
            <ul style={{ marginBottom: 0 }}>
                {message.list.map((item, i) => <li key={`i${i}`}>{item}</li>)}
            </ul>
        ) : null;

        return (
            <span>
                {title}
                {detail}
                {list}
            </span>
        );
    }
    render() {
        const { message, type } = this.props;

        return (
            <Alert color={type}>
                {this.renderMessage(message)}
            </Alert>
        );
    }
}
