import * as React from 'react';

import * as _ from 'lodash';
import { findDOMNode } from 'react-dom';

// let Button = require('elemental').Button;
// let FormField = require('elemental').FormField;
// let FormInput = require('elemental').FormInput;
import { Button, FormField, FormInput } from 'elemental';
import { FieldBase, FieldPropsBase } from './Field';

export interface ArrayFieldPropsBase extends FieldPropsBase {
    value?: any[];
}


let lastId = 0;
let ENTER_KEYCODE = 13;

function newItem(value) {
    lastId = lastId + 1;
    return { key: 'i' + lastId, value: value };
}

function reduceValues(values) {
    return values.map(i => i.value);
}

export abstract class ArrayFieldBase<T extends ArrayFieldPropsBase> extends FieldBase<T> {
    formatValue: Function;
    processInputValue: Function;
    getInputComponent: Function;
    cleanInput: Function;

    static defaultProps() {
        let props = FieldBase.defaultProps();
        return {
            ...props
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            values: Array.isArray(this.props.value) ? this.props.value.map(newItem) : [],
            ...this.state
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value.join('|') !== reduceValues(this.state.values).join('|')) {
            this.setState({
                values: nextProps.value.map(newItem),
            });
        }
    }

    addItem() {
        let newValues = this.state.values.concat(newItem(''));
        this.setState({
            values: newValues,
        }, () => {
            if (!this.state.values.length) return;
            findDOMNode<HTMLElement>(this.refs['item_' + this.state.values.length]).focus();
        });
        this.valueChanged(reduceValues(newValues));
    }

    removeItem(i) {
        let newValues = _.without(this.state.values, i);
        this.setState({
            values: newValues,
        }, function () {
            findDOMNode<HTMLElement>(this.refs.button).focus();
        });
        this.valueChanged(reduceValues(newValues));
    }

    updateItem(i, event) {
        let updatedValues = this.state.values;
        let updateIndex = updatedValues.indexOf(i);
        let newValue = event.value || event.target.value;
        updatedValues[updateIndex].value = this.cleanInput ? this.cleanInput(newValue) : newValue;
        this.setState({
            values: updatedValues,
        });
        this.valueChanged(reduceValues(updatedValues));
    }

    valueChanged(values) {
        this.props.onChange({
            path: this.props.path,
            value: values,
        });
    }

    renderField() {
        return (
            <div>
                {this.state.values.map(this.renderItem)}
                <Button ref="button" onClick={this.addItem}>Add item</Button>
            </div>
        );
    }

    renderItem(item, index) {
        const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
        const value = this.processInputValue ? this.processInputValue(item.value) : item.value;
        return (
            <FormField key={item.key}>
                <Input ref={'item_' + (index + 1)} name={this.getInputName(this.props.path)} value={value} onChange={this.updateItem.bind(this, item)} onKeyDown={this.addItemOnEnter} autoComplete="off" />
                <Button type="link-cancel" onClick={this.removeItem.bind(this, item)} className="keystone-relational-button">
                    <span className="octicon octicon-x" />
                </Button>
            </FormField>
        );
    }

    renderValue() {
        const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
        return (
            <div>
                {this.state.values.map((item, i) => {
                    const value = this.formatValue ? this.formatValue(item.value) : item.value;
                    return (
                        <div key={i} style={i ? { marginTop: '1em' } : null}>
                            <Input noedit value={value} />
                        </div>
                    );
                })}
            </div>
        );
    }

    // Override shouldCollapse to check for array length
    shouldCollapse() {
        return this.props.collapse && !this.props.value.length;
    }

    addItemOnEnter(event) {
        if (event.keyCode === ENTER_KEYCODE) {
            this.addItem();
            event.preventDefault();
        }
    }
}
