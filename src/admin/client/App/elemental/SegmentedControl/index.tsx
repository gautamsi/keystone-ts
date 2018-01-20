import * as React from 'react';
import { css } from 'glamor';
import classes from './styles';
import colors from './colors';

export const SegmentedControl: React.SFC<Props> = ({
	className,
    color,
    cropText,
    equalWidthSegments,
    inline,
    onChange,
    options,
    value,
    ...props
}) => {
    props['className'] = css(
        classes.control,
        inline ? classes.control__inline : null,
        className
    );

    return (
        <div {...props}>
            {options.map((opt) => {
                const buttonClassName = css(
                    classes.button,
                    opt.disabled ? classes.button__disabled : null,
                    opt.value === value ? classes['button__' + color] : null,
                    cropText ? classes.button__cropText : null,
                    equalWidthSegments ? classes.button__equalWidth : null
                );

                return (
                    <button
                        className={`${buttonClassName}`}
                        key={opt.value as any}
                        onClick={() => !opt.disabled ? onChange(opt.value) : undefined}
                        type="button"
                        title={cropText ? opt.label : null}
                        tabIndex={opt.disabled ? -1 : null}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>);
};

export interface Props {
    color?: 'danger' | 'default' | 'error' | 'info' | 'primary' | 'success' | 'warning';
    cropText?: boolean; // when `inline && equalWidthSegments` crops to the next largest option length
    equalWidthSegments?: boolean; // only relevant when `inline === false`
    inline?: boolean;
    onChange: any;
    options: {
        disabled?: boolean;
        label?: string;
        value?: boolean | number | string;
    }[];
    value?: boolean | number | string;
    className?: any;
}

SegmentedControl.defaultProps = {
    color: 'default',
};
