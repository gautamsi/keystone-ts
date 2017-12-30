/**
TODO:
- Format size of stored file (if present) using bytes package?
- Display file type icon? (see LocalFileField)
*/

import * as Field from '../Field';
import * as React from 'react';
import {
    Button,
    FormField,
    FormInput,
    FormNote,
} from 'elemental';
import { FileChangeMessage } from '../../components/FileChangeMessage';
import { HiddenFileInput } from '../../components/HiddenFileInput';

let uploadInc = 1000;

const buildInitialState = (props) => ({
    action: null,
    removeExisting: false,
    uploadFieldPath: `File-${props.path}-${++uploadInc}`,
    userSelectedFile: null,
});

export const FileField = Field.create({
    propTypes: {
        autoCleanup: React.PropTypes.bool,
        collapse: React.PropTypes.bool,
        label: React.PropTypes.string,
        note: React.PropTypes.string,
        path: React.PropTypes.string.isRequired,
        value: React.PropTypes.shape({
            filename: React.PropTypes.string,
            // TODO: these are present but not used in the UI,
            //       should we start using them?
            // filetype: PropTypes.string,
            // originalname: PropTypes.string,
            // path: PropTypes.string,
            // size: PropTypes.number,
        }),
    },
    statics: {
        type: 'File',
        getDefaultValue: () => ({}),
    },
    getInitialState() {
        return buildInitialState(this.props);
    },
    shouldCollapse() {
        return this.props.collapse && !this.hasExisting();
    },
    componentWillUpdate(nextProps) {
        // Show the new filename when it's finished uploading
        if (this.props.value.filename !== nextProps.value.filename) {
            this.setState(buildInitialState(nextProps));
        }
    },

    // ==============================
    // HELPERS
    // ==============================

    hasFile() {
        return this.hasExisting() || !!this.state.userSelectedFile;
    },
    hasExisting() {
        return this.props.value && !!this.props.value.filename;
    },
    getFilename() {
        return this.state.userSelectedFile
            ? this.state.userSelectedFile.name
            : this.props.value.filename;
    },

    // ==============================
    // METHODS
    // ==============================

    triggerFileBrowser() {
        this.refs.fileInput.clickDomNode();
    },
    handleFileChange(event) {
        const userSelectedFile = event.target.files[0];

        this.setState({
            userSelectedFile: userSelectedFile,
        });
    },
    handleRemove(e) {
        let state: any = {};

        if (this.state.userSelectedFile) {
            state = buildInitialState(this.props);
        } else if (this.hasExisting()) {
            state.removeExisting = true;

            if (this.props.autoCleanup) {
                if (e.altKey) {
                    state.action = 'reset';
                } else {
                    state.action = 'delete';
                }
            } else {
                if (e.altKey) {
                    state.action = 'delete';
                } else {
                    state.action = 'reset';
                }
            }
        }

        this.setState(state);
    },
    undoRemove() {
        this.setState(buildInitialState(this.props));
    },

    // ==============================
    // RENDERERS
    // ==============================

    renderFileNameAndChangeMessage() {
        const href = this.props.value ? this.props.value.url : undefined;
        return (
            <div>
                {(this.hasFile() && !this.state.removeExisting) ? (
                    <FileChangeMessage component={href ? 'a' : 'span'} href={href} target="_blank">
                        {this.getFilename()}
                    </FileChangeMessage>
                ) : null}
                {this.renderChangeMessage()}
            </div>
        );
    },
    renderChangeMessage() {
        if (this.state.userSelectedFile) {
            return (
                <FileChangeMessage color="success">
                    Save to Upload
				</FileChangeMessage>
            );
        } else if (this.state.removeExisting) {
            return (
                <FileChangeMessage color="danger">
                    File {this.props.autoCleanup ? 'deleted' : 'removed'} - save to confirm
				</FileChangeMessage>
            );
        } else {
            return null;
        }
    },
    renderClearButton() {
        if (this.state.removeExisting) {
            return (
                <Button variant="link" onClick={this.undoRemove}>
                    Undo Remove
				</Button>
            );
        } else {
            let clearText;
            if (this.state.userSelectedFile) {
                clearText = 'Cancel Upload';
            } else {
                clearText = (this.props.autoCleanup ? 'Delete File' : 'Remove File');
            }
            return (
                <Button variant="link" color="cancel" onClick={this.handleRemove}>
                    {clearText}
                </Button>
            );
        }
    },
    renderActionInput() {
        // If the user has selected a file for uploading, we need to point at
        // the upload field. If the file is being deleted, we submit that.
        if (this.state.userSelectedFile || this.state.action) {
            const value = this.state.userSelectedFile
                ? `upload:${this.state.uploadFieldPath}`
                : (this.state.action === 'delete' ? 'remove' : '');
            return (
                <input
                    name={this.getInputName(this.props.path)}
                    type="hidden"
                    value={value}
                />
            );
        } else {
            return null;
        }
    },
    renderUI() {
        const { label, note, path } = this.props;
        const buttons = (
            <div style={this.hasFile() ? { marginTop: '1em' } : null}>
                <Button onClick={this.triggerFileBrowser}>
                    {this.hasFile() ? 'Change' : 'Upload'} File
				</Button>
                {this.hasFile() && this.renderClearButton()}
            </div>
        );

        return (
            <div data-field-name={path} data-field-type="file">
                <FormField label={label} htmlFor={path}>
                    {this.shouldRenderField() ? (
                        <div>
                            {this.hasFile() && this.renderFileNameAndChangeMessage()}
                            {buttons}
                            <HiddenFileInput
                                key={this.state.uploadFieldPath}
                                name={this.state.uploadFieldPath}
                                onChange={this.handleFileChange}
                                ref="fileInput"
                            />
                            {this.renderActionInput()}
                        </div>
                    ) : (
                            <div>
                                {this.hasFile()
                                    ? this.renderFileNameAndChangeMessage()
                                    : <FormInput noedit>no file</FormInput>}
                            </div>
                        )}
                    {!!note && <FormNote html={note} />}
                </FormField>
            </div>
        );
    },

});
