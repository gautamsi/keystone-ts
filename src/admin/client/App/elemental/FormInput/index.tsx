import * as React from 'react';
import { css } from 'glamor';
import classes from './styles';
import { concatClassnames } from '../../../utils/concatClassnames';
import { FormInputNoedit } from './noedit';
import * as PropTypes from 'prop-types';

// NOTE must NOT be functional component to allow `refs`

export class FormInput extends React.Component<Props> {

    target: HTMLElement;
    blur() {
        this.target.blur();
    }
    focus() {
        this.target.focus();
    }
    render() {
        const {
			cssStyles,
            className,
            disabled,
            id,
            multiline,
            noedit,
            size,
            ...props
		} = this.props;

        // NOTE return a different component for `noedit`
        if (noedit) return <FormInputNoedit {...this.props} />;

        const { formFieldId, formLayout } = this.context;

        props['id'] = id || formFieldId;
        props['className'] = css(
            classes.FormInput,
            classes['FormInput__size--' + size],
            disabled ? classes['FormInput--disabled'] : null,
            formLayout ? classes['FormInput--form-layout-' + formLayout] : null,
            ...concatClassnames(cssStyles)
        );
        if (className) {
            props['className'] += (' ' + className);
        }

        const setRef = (n) => (this.target = n);
        const Tag = multiline ? 'textarea' : 'input';

        return (
            <Tag
                ref={setRef}
                disabled={disabled}
                {...props}
            />
        );
    }
    static get defaultProps() {
        return {
            size: 'default',
            type: 'text',
        };
    }
    static contextTypes = {
        formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
        formFieldId: PropTypes.string,
    };
}

const stylesShape = {
    _definition: PropTypes.object,
    _name: PropTypes.string,
};

export interface Props {
    cssStyles?: any;
    // PropTypes.oneOfType([
    //     PropTypes.arrayOf(PropTypes.shape(stylesShape)),
    //     PropTypes.shape(stylesShape),
    // ]),
    multiline?: boolean;
    size?: 'default' | 'small' | 'large';
    type?: string;
    disabled?: boolean;
    className?: string;
    noedit?: boolean;
    id?: string;
    onChange?: any;
    placeholder?: any;
    value?: any;
    autoFocus?: any;
    autoComplete?: any;
    name?: any;
    onClick?: any;
    style?: any;
}
