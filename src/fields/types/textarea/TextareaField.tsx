import * as React from 'react';
import { FormInput } from '../../../admin/client/App/elemental';
import { FieldBase, FieldPropsBase } from '../FieldBase';

export interface Props extends FieldPropsBase {
    height?: any;
    style?: any;
}

export class TextareaField extends FieldBase<Props> {
    static displayName: string = 'TextareaField';
    static type: string = 'Textarea';
    renderValue() {
        const { height } = this.props;

        const styles = {
            height: height,
            whiteSpace: 'pre-wrap',
            overflowY: 'auto',
        };
        return (
            <FormInput multiline noedit style={styles}>{this.props.value}</FormInput>
        );
    }
    renderField() {
        const { height, path, style, value } = this.props;

        const styles = {
            height: height,
            ...style,
        };
        return (
            <FormInput
                autoComplete="off"
                multiline
                name={this.getInputName(path)}
                onChange={this.valueChanged}
                ref="focusTarget"
                style={styles}
                value={value}
            />
        );
    }
}
