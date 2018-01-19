import { css } from 'glamor';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import classes from './styles';

export class FormSelect extends React.Component<Props> {

    static contextTypes = {
        formFieldId: PropTypes.string,
    };
    render() {
        const { children, id, options, ...props } = this.props;
        const { formFieldId } = this.context;

        props['className'] = css(
            classes.select,
            props.disabled ? classes['select--disabled'] : null
        );
        props['id'] = id || formFieldId;

        // Property Violation
        if (options && children) {
            console.error('Warning: FormSelect cannot render `children` and `options`. You must provide one or the other.');
        }

        return (
            <div className={`${css(classes.container)}`}>
                {options ? (
                    <select {...props}>{options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                    </select>
                ) : <select {...props}>{children}</select>}
                <span className={`${css(classes.arrows, props.disabled ? classes['arrows--disabled'] : null)}`}>
                    <span className={`${css(classes.arrow, classes.arrowTop)}`} />
                    <span className={`${css(classes.arrow, classes.arrowBottom)}`} />
                </span>
            </div>
        );
    }
}

export interface Props {
    onChange: any;
    options?: {
        label?: string;
        value?: string;
    }[];
    value: number | string;
    id?: any;
    disabled?: any;
}
