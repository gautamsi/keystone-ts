import { css } from 'glamor';
import * as React from 'react';
import classes from './styles';

export const LabelledControl: React.SFC<Props> = ({
	className,
    inline,
    label,
    title,
    ...props
}) => {
    const labelClassName = css(
        classes.wrapper,
        inline && classes.wrapper__inline,
        className
    );

    return (
        <label title={title} className={`${labelClassName}`}>
            <input {...props} className={`${css(classes.control)}`} />
            <span className={`${css(classes.label)}`}>{label}</span>
        </label>
    );
};

export interface Props {
    inline?: boolean;
    title?: string;
    type: 'checkbox' | 'radio';
    label?: any;
    className?: any;
    checked?: any;
    onChange?: any;
    value?: any;
    autoFocus?: any;
    name?: any;
}
