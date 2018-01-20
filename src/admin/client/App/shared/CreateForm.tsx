/**
 * The form that's visible when "Create <ItemName>" is clicked on either the
 * List screen or the Item screen
 */

import * as React from 'react';
import * as vkey from 'vkey';
import { AlertMessages } from './AlertMessages';
import { Fields } from 'FieldTypes';
import { InvalidFieldType } from './InvalidFieldType';
import { Button, Form, ModalDialog, ModalBody, ModalFooter, ModalHeader } from '../elemental';

export interface Props {
    err?: any;
    isOpen?: boolean;
    list?: any;
    onCancel?: any;
    onCreate?: any;
}

export class CreateForm extends React.Component<Props, any> {
    static displayName: string = 'CreateForm';
    static get defaultProps() {
        return {
            err: null,
            isOpen: false,
        };
    }
    constructor(props) {
        super(props);
        // Set the field values to their default values when first rendering the
        // form. (If they have a default value, that is)
        let values = {};
        Object.keys(this.props.list.fields).forEach(key => {
            let field = this.props.list.fields[key];
            let FieldComponent = Fields[field.type];
            values[field.path] = FieldComponent.getDefaultValue(field);
        });
        this.state = {
            values: values,
            alerts: {},
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    componentDidMount() {
        document.body.addEventListener('keyup', this.handleKeyPress, false);
    }
    componentWillUnmount() {
        document.body.removeEventListener('keyup', this.handleKeyPress, false);
    }
    handleKeyPress(evt) {
        if (vkey[evt.keyCode] === '<escape>') {
            this.props.onCancel();
        }
    }
    // Handle input change events
    handleChange = (event) => {
        let values = Object.assign({}, this.state.values);
        values[event.path] = event.value;
        this.setState({
            values: values,
        });
    };
    // Set the props of a field
    getFieldProps(field) {
        let props = Object.assign({}, field);
        props.value = this.state.values[field.path];
        props.values = this.state.values;
        props.onChange = this.handleChange;
        props.mode = 'create';
        props.key = field.path;
        return props;
    }
    // Create a new item when the form is submitted
    submitForm = (event) => {
        event.preventDefault();
        const createForm = event.target;
        const formData = new FormData(createForm);
        this.props.list.createItem(formData, (err, data) => {
            if (data) {
                if (this.props.onCreate) {
                    this.props.onCreate(data);
                } else {
                    // Clear form
                    this.setState({
                        values: {},
                        alerts: {
                            success: {
                                success: 'Item created',
                            },
                        },
                    });
                }
            } else {
                if (!err) {
                    err = {
                        error: 'connection error',
                    };
                }
                // If we get a database error, show the database error message
                // instead of only saying "Database error"
                if (err.error === 'database error') {
                    err.error = err.detail.errmsg;
                }
                this.setState({
                    alerts: {
                        error: err,
                    },
                });
            }
        });
    };
    // Render the form itself
    renderForm() {
        if (!this.props.isOpen) return;

        let form = [];
        let list = this.props.list;
        let nameField = this.props.list.nameField;
        let focusWasSet;

        // If the name field is an initial one, we need to render a proper
        // input for it
        if (list.nameIsInitial) {
            let nameFieldProps = this.getFieldProps(nameField);
            nameFieldProps.autoFocus = focusWasSet = true;
            if (nameField.type === 'text') {
                nameFieldProps.className = 'item-name-field';
                nameFieldProps.placeholder = nameField.label;
                nameFieldProps.label = '';
            }
            form.push(React.createElement(Fields[nameField.type], nameFieldProps));
        }

        // Render inputs for all initial fields
        Object.keys(list.initialFields).forEach(key => {
            let field = list.fields[list.initialFields[key]];
            // If there's something weird passed in as field type, render the
            // invalid field type component
            if (typeof Fields[field.type] !== 'function') {
                form.push(React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path }));
                return;
            }
            // Get the props for the input field
            let fieldProps = this.getFieldProps(field);
            // If there was no focusRef set previously, set the current field to
            // be the one to be focussed. Generally the first input field, if
            // there's an initial name field that takes precedence.
            if (!focusWasSet) {
                fieldProps.autoFocus = focusWasSet = true;
            }
            form.push(React.createElement(Fields[field.type], fieldProps));
        });

        return (
            <Form layout="horizontal" onSubmit={this.submitForm}>
                <ModalHeader
                    text={'Create a new ' + list.singular}
                    showCloseButton
                />
                <ModalBody>
                    <AlertMessages alerts={this.state.alerts} />
                    {form}
                </ModalBody>
                <ModalFooter>
                    <Button color="success" type="submit" data-button-type="submit">
                        Create
					</Button>
                    <Button
                        variant="link"
                        color="cancel"
                        data-button-type="cancel"
                        onClick={this.props.onCancel}
                    >
                        Cancel
					</Button>
                </ModalFooter>
            </Form>
        );
    }
    render() {
        return (
            <ModalDialog
                isOpen={this.props.isOpen}
                onClose={this.props.onCancel}
                backdropClosesModal
            >
                {this.renderForm()}
            </ModalDialog>
        );
    }
}
