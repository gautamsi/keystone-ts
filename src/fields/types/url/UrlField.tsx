import * as React from 'react';
import { GlyphButton, FormInput } from '../../../admin/client/App/elemental';
import { FieldBase, FieldPropsBase } from '../FieldBase';

export class UrlField extends FieldBase<FieldPropsBase> {
    static displayName: string = 'URLField';
    static type: string = 'Url';
    openValue = () => {
        let href = this.props.value;
        if (!href) return;
        if (!/^(mailto\:)|(\w+\:\/\/)/.test(href)) {
            href = 'http://' + href;
        }
        window.open(href);
    };
    renderLink() {
        if (!this.props.value) return null;

        return (
            <GlyphButton
                className="keystone-relational-button"
                glyph="link"
                onClick={this.openValue}
                title={'Open ' + this.props.value + ' in a new tab'}
                variant="link"
            />
        );
    }
    renderField() {
        return (
            <FormInput
                autoComplete="off"
                name={this.getInputName(this.props.path)}
                onChange={this.valueChanged}
                ref="focusTarget"
                type="url"
                value={this.props.value}
            />
        );
    }
    wrapField() {
        return (
            <div style={{ position: 'relative' }}>
                {this.renderField()}
                {this.renderLink()}
            </div>
        );
    }
    renderValue() {
        const { value } = this.props;
        return (
            <FormInput noedit onClick={value ? this.openValue : undefined}>
                {value}
            </FormInput>
        );
    }
}
