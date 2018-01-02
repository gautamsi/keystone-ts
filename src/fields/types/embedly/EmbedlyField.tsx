import * as React from 'react';
import { FormField, FormInput } from 'elemental';
import { ImageThumbnail } from '../../components/ImageThumbnail';
import { NestedFormField } from '../../components/NestedFormField';
import { FieldPropsBase, FieldBase } from '../Field';


export class EmbedlyField extends FieldBase<FieldPropsBase> {

    static displayName: string = 'EmbedlyField';
    static type: string = 'Embedly';
    static getDefaultValue() {
        return {};
    }

    // always defers to renderValue; there is no form UI for this field
    renderField() {
        return this.renderValue();
    }

    renderValue(path?, label?, multiline?) { // ref: had to use all optional to comply with typescript inheritance issue
        return (
            <NestedFormField key={path} label={label}>
                <FormInput noedit multiline={multiline}>{this.props.value[path]}</FormInput>
            </NestedFormField>
        );
    }
    renderAuthor() {
        if (!this.props.value.authorName) return;
        return (
            <NestedFormField key="author" label="Author">
                <FormInput noedit href={this.props.value.authorUrl && this.props.value.authorUrl} target="_blank">{this.props.value.authorName}</FormInput>
            </NestedFormField>
        );
    }
    renderDimensions() {
        if (!this.props.value.width || !this.props.value.height) return;
        return (
            <NestedFormField key="dimensions" label="Dimensions">
                <FormInput noedit>{this.props.value.width} &times; {this.props.value.height}px</FormInput>
            </NestedFormField>
        );
    }
    renderPreview() {
        if (!this.props.value.thumbnailUrl) return;

        let image = <img width={this.props.value.thumbnailWidth} height={this.props.value.thumbnailHeight} src={this.props.value.thumbnailUrl} />;

        let preview = this.props.value.url ? (
            <ImageThumbnail component="a" href={this.props.value.url} target="_blank">
                {image}
            </ImageThumbnail>
        ) : (
                <ImageThumbnail>{image}</ImageThumbnail>
            );

        return (
            <NestedFormField label="Preview">
                {preview}
            </NestedFormField>
        );
    }

    renderUI() {
        if (!this.props.value.exists) {
            return (
                <FormField label={this.props.label}>
                    <FormInput noedit>(not set)</FormInput>
                </FormField>
            );
        }
        return (
            <div>
                <FormField key="provider" label={this.props.label}>
                    <FormInput noedit>{this.props.value.providerName} {this.props.value.type}</FormInput>
                </FormField>
                {this.renderValue('title', 'Title')}
                {this.renderAuthor()}
                {this.renderValue('description', 'Description', true)}
                {this.renderPreview()}
                {this.renderDimensions()}
            </div>
        );
    }
}
