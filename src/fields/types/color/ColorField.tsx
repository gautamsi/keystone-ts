import { SketchPicker } from 'react-color';
import { css } from 'glamor';
import { FieldBase, FieldPropsBase } from '../FieldBase';
import * as React from 'react';
import {
    Button,
    FormInput,
    InlineGroup as Group,
    InlineGroupSection as Section,
} from 'elemental';
import { transparentSwatch } from './transparent-swatch';
import { theme } from '../../../admin/client/theme';

interface Props extends FieldPropsBase {
    onChange?: any;
    path?: string;
    value?: string;
}

export class ColorField extends FieldBase<Props> {
    static displayName: string = 'ColorField';
    static type: string = 'Color';


    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false,
        };
    }
    updateValue(value) {
        this.props.onChange({
            path: this.props.path,
            value: value,
        });
    }
    handleInputChange(event) {
        let newValue = event.target.value;
        if (/^([0-9A-F]{3}){1,2}$/.test(newValue)) {
            newValue = '#' + newValue;
        }
        if (newValue === this.props.value) return;

        this.updateValue(newValue);
    }
    handleClick() {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }
    handleClose() {
        this.setState({ displayColorPicker: false });
    }
    handlePickerChange(color) {
        let newValue = color.hex;

        if (newValue === this.props.value) return;

        this.updateValue(newValue);
    }
    renderSwatch() {
        const className = `${css(classes.swatch)} e2e-type-color__swatch`;

        return (this.props.value) ? (
            <span
                className={className}
                style={{ backgroundColor: this.props.value }}
            />
        ) : (
                <span
                    className={className}
                    dangerouslySetInnerHTML={{ __html: transparentSwatch }}
                />
            );
    }
    renderField() {
        const { displayColorPicker } = this.state;

        return (
            <div className="e2e-type-color__wrapper" style={{ position: 'relative' }}>
                <Group>
                    <Section grow>
                        <FormInput
                            autoComplete="off"
                            name={this.getInputName(this.props.path)}
                            onChange={this.valueChanged}
                            ref="field"
                            value={this.props.value}
                        />
                    </Section>
                    <Section>
                        <Button onClick={this.handleClick} cssStyles={classes.button} data-e2e-type-color__button>
                            {this.renderSwatch()}
                        </Button>
                    </Section>
                </Group>
                {displayColorPicker && (
                    <div>
                        <div
                            className={`${css(classes.blockout)}`}
                            data-e2e-type-color__blockout
                            onClick={this.handleClose}
                        />
                        <div className={`${css(classes.popover)}`} onClick={e => e.stopPropagation()} data-e2e-type-color__popover>
                            <SketchPicker
                                color={this.props.value}
                                onChangeComplete={this.handlePickerChange}
                                onClose={this.handleClose}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

/* eslint quote-props: ["error", "as-needed"] */
const classes = {
    button: {
        background: 'white',
        padding: 4,
        width: theme.component.height,

        ':hover': {
            background: 'white',
        },
    },
    blockout: {
        bottom: 0,
        left: 0,
        position: 'fixed',
        right: 0,
        top: 0,
        zIndex: 1,
    },
    popover: {
        marginTop: 10,
        position: 'absolute',
        left: 0,
        zIndex: 2,
    },
    swatch: {
        borderRadius: 1,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
        display: 'block',
        height: '100%',
        width: '100%',
    },
};
