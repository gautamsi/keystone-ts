/**
 * Render a popout list item
 */

import * as React from 'react';
import * as blacklist from 'blacklist';
import * as classnames from 'classnames';

export interface Props {
    icon?: string;
    iconHover?: string;
    isSelected?: boolean;
    label?: string;
    onClick?: any;
}

export class PopoutListItem extends React.Component<Props, any> {
    static displayName: string = 'PopoutListItem';
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
        };
    }
    hover = () => {
        this.setState({ hover: true });
    };
    unhover = () => {
        this.setState({ hover: false });
    };
    // Render an icon
    renderIcon() {
        if (!this.props.icon) return null;
        const icon = this.state.hover && this.props.iconHover ? this.props.iconHover : this.props.icon;
        const iconClassname = classnames('PopoutList__item__icon octicon', ('octicon-' + icon));

        return <span className={iconClassname} />;
    }
    render() {
        const itemClassname = classnames('PopoutList__item', {
            'is-selected': this.props.isSelected,
        });
        const props = blacklist(this.props, 'className', 'icon', 'iconHover', 'isSelected', 'label');
        return (
            <button
                type="button"
                title={this.props.label}
                className={itemClassname}
                onFocus={this.hover}
                onBlur={this.unhover}
                onMouseOver={this.hover}
                onMouseOut={this.unhover}
                {...props}
            >
                {this.renderIcon()}
                <span className="PopoutList__item__label">
                    {this.props.label}
                </span>
            </button>
        );
    }
}
