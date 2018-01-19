import { css } from 'glamor';
import * as React from 'react';
import * as styles from './styles';

const commonClasses = styles.common;
const stylesheetCache = {};
function getStyleSheet(variant, color) {
    const cacheKey = `${variant}-${color}`;
    if (!stylesheetCache[cacheKey]) {
        const variantStyles = styles[variant](color);
        stylesheetCache[cacheKey] = variantStyles;
    }
    return stylesheetCache[cacheKey];
}

export type BUTTON_SIZES = 'large' | 'medium' | 'small' | 'xsmall';
export type BUTTON_VARIANTS = 'fill' | 'hollow' | 'link';
export type BUTTON_COLORS = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'cancel' | 'delete';

// NOTE must NOT be functional component to allow `refs`

export class Button extends React.Component<Props> {
    static get defaultProps() {
        return {
            cssStyles: [],
            color: 'default',
            variant: 'fill',
        };
    }

    render() {
        let {
			active,
            cssStyles,
            block,
            className,
            color,
            component: Tag,
            disabled,
            size,
            variant,
            ...props
		} = this.props;

        // get the styles
        const variantClasses = getStyleSheet(variant, color);
        props['className'] = css(
            commonClasses.base,
            commonClasses[size],
            variantClasses.base,
            block ? commonClasses.block : null,
            disabled ? commonClasses.disabled : null,
            active ? variantClasses.active : null,
            ...cssStyles
        );
        if (className) {
            props['className'] += (' ' + className);
        }

        // return an anchor or button
        if (!Tag) {
            Tag = props.href ? 'a' : 'button';
        }
        // Ensure buttons don't submit by default
        if (Tag === 'button' && !props.type) {
            (props as any)['type'] = 'button';
        }

        return <Tag {...props} />;
    }
}

export interface Props {
    active?: boolean;
    block?: boolean;
    color?: BUTTON_COLORS;
    component?: any;
    cssStyles?: {
        _definition?: object;
        _name?: string;
    }[];
    disabled?: boolean;
    href?: string;
    size?: BUTTON_SIZES;
    variant?: BUTTON_VARIANTS;
    className?: any;
    type?: string;
    onClick?: any;
    style?: any;
}
