/**
 * Render a header for a popout
 */

import * as React from 'react';
import Transition from 'react-transition-group/Transition';

export interface Props {
    leftAction?: any;
    leftIcon?: string;
    title: string;
    transitionDirection?: 'next' | 'prev';
}
export class PopoutHeader extends React.Component<Props, {}> {
    displayName: string = 'PopoutHeader';

    render() {
        // If we have a left action and a left icon, render a header button
        let headerButton = (this.props.leftAction && this.props.leftIcon) ? (
            <button
                key={'button_' + this.props.transitionDirection}
                type="button"
                className={'Popout__header__button octicon octicon-' + this.props.leftIcon}
                onClick={this.props.leftAction}
            />
        ) : null;
        // If we have a title, render it
        let headerTitle = this.props.title ? (
            <span
                key={'title_' + this.props.transitionDirection}
                className="Popout__header__label"
            >
                {this.props.title}
            </span>
        ) : null;

        return (
            <div className="Popout__header">
                <Transition
                    classNames="Popout__header__button"
                    timeout={200}
                >
                    {headerButton}
                </Transition>
                <Transition
                    classNames={'Popout__pane-' + this.props.transitionDirection}
                    timeout={360}
                >
                    {headerTitle}
                </Transition>
            </div>
        );
    }
}
