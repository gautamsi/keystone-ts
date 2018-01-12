import { css } from 'glamor';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import classes from './styles';
import colors from './colors';


export const Chip: React.SFC<Props> = ({
	children,
    color,
    inverted,
    label,
    onClear,
    onClick,
    ...props
}) => {
    props.className = css(
        classes.chip,
        props.className
    );
    const labelClassName = css(
        classes.button,
        classes.label,
        classes['button__' + color + (inverted ? '__inverted' : '')]
    );
    const clearClassName = css(
        classes.button,
        classes.clear,
        classes['button__' + color + (inverted ? '__inverted' : '')]
    );

    return (
        <div {...props}>
            <button type="button" onClick={onClick} className={`${labelClassName}`}>
                {label}
                {children}
            </button>
            {!!onClear && (
                <button type="button" onClick={onClear} className={`${clearClassName}`}>
                    &times;
				</button>
            )}
        </div>
    );
};

export { colors };
export interface Props {
    className?: any;
    color?: any; // keyof colors;
    inverted?: boolean;
    label: string;
    onClear?: PropTypes.func;
    onClick?: PropTypes.func;
}

Chip.defaultProps = {
    color: 'default',
};
