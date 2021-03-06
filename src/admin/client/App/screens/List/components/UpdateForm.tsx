import * as React from 'react';
import Select from 'react-select';
import { findDOMNode } from 'react-dom';
import { Fields } from 'FieldTypes';
import { InvalidFieldType } from '../../../shared/InvalidFieldType';
import { plural } from '../../../../utils/string';
import { BlankState, Button, Form, ModalDialog, ModalBody, ModalFooter, ModalHeader } from '../../../elemental';

export interface Props {
    isOpen?: boolean;
    itemIds?: Array<any>;
    list?: any;
    onCancel?: any;
}
export class UpdateForm extends React.Component<Props, any> {
    static displayName: string = 'UpdateForm';
    static get defaultProps() {
        return {
            isOpen: false,
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            fields: [],
        };
    }
    componentDidMount() {
        this.doFocus();
    }
    componentDidUpdate() {
        this.doFocus();
    }
    doFocus() {
        if (this.refs.focusTarget) {
            findDOMNode<HTMLElement>(this.refs.focusTarget).focus();
        }
    }
    getOptions = () => {
        const { fields } = this.props.list;
        return Object.keys(fields).map(key => ({ value: fields[key].path, label: fields[key].label }));
    };
    getFieldProps(field) {
        let props = Object.assign({}, field);
        props.value = this.state.fields[field.path];
        props.values = this.state.fields;
        props.onChange = this.handleChange;
        props.mode = 'create';
        props.key = field.path;
        return props;
    }
    updateOptions = (fields) => {
        this.setState({
            fields: fields,
        }, this.doFocus);
    };
    handleChange(value) {
        console.log('handleChange:', value);
    }
    handleClose = () => {
        this.setState({
            fields: [],
        });
        this.props.onCancel();
    };

    renderFields() {
        const { list } = this.props;
        const { fields } = this.state;
        const formFields = [];
        let focusRef;

        fields.forEach((fieldOption) => {
            const field = list.fields[fieldOption.value];

            if (typeof Fields[field.type] !== 'function') {
                formFields.push(React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path }));
                return;
            }
            let fieldProps = this.getFieldProps(field);
            if (!focusRef) {
                fieldProps.ref = focusRef = 'focusTarget';
            }
            formFields.push(React.createElement(Fields[field.type], fieldProps));
        });

        const fieldsUI = formFields.length ? formFields : (
            <BlankState
                heading="Choose a field above to begin"
                style={{ padding: '3em 2em' }}
            />
        );

        return (
            <div style={{ borderTop: '1px dashed rgba(0,0,0,0.1)', marginTop: 20, paddingTop: 20 }}>
                {fieldsUI}
            </div>
        );
    }
    renderForm() {
        const { itemIds, list } = this.props;
        const itemCount = plural(itemIds, ('* ' + list.singular), ('* ' + list.plural));
        const formAction = `${Keystone.adminPath}/${list.path}`;

        return (
            <Form layout="horizontal" action={formAction} noValidate="true">
                <ModalHeader
                    onClose={this.handleClose}
                    showCloseButton
                    text={'Update ' + itemCount}
                />
                <ModalBody>
                    <Select
                        key="field-select"
                        multi
                        onChange={this.updateOptions}
                        options={this.getOptions()}
                        ref="initialFocusTarget"
                        value={this.state.fields}
                    />
                    {this.renderFields()}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" type="submit">Update</Button>
                    <Button color="cancel" variant="link" onClick={this.handleClose}>Cancel</Button>
                </ModalFooter>
            </Form>
        );
    }
    render() {
        return (
            <ModalDialog isOpen={this.props.isOpen} onClose={this.handleClose} backdropClosesModal>
                {this.renderForm()}
            </ModalDialog>
        );
    }
}
