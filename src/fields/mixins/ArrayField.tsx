import * as React from 'react';

import * as _ from 'lodash';
import { findDOMNode } from 'react-dom';

// let Button = require('elemental').Button;
// let FormField = require('elemental').FormField;
// let FormInput = require('elemental').FormInput;
import { Button, FormField, FormInput } from 'elemental';

let lastId = 0;
let ENTER_KEYCODE = 13;

function newItem(value) {
    lastId = lastId + 1;
    return { key: 'i' + lastId, value: value };
}

function reduceValues(values) {
    return values.map(i => i.value);
}

export function getInitialState() {
    return {
        values: Array.isArray(this.props.value) ? this.props.value.map(newItem) : [],
    };
}

export function componentWillReceiveProps(nextProps) {
    if (nextProps.value.join('|') !== reduceValues(this.state.values).join('|')) {
        this.setState({
            values: nextProps.value.map(newItem),
        });
    }
}

export function addItem() {
    let newValues = this.state.values.concat(newItem(''));
    this.setState({
        values: newValues,
    }, () => {
        if (!this.state.values.length) return;
        findDOMNode<HTMLElement>(this.refs['item_' + this.state.values.length]).focus();
    });
    this.valueChanged(reduceValues(newValues));
}

export function removeItem(i) {
    let newValues = _.without(this.state.values, i);
    this.setState({
        values: newValues,
    }, function () {
        findDOMNode<HTMLElement>(this.refs.button).focus();
    });
    this.valueChanged(reduceValues(newValues));
}

export function updateItem(i, event) {
    let updatedValues = this.state.values;
    let updateIndex = updatedValues.indexOf(i);
    let newValue = event.value || event.target.value;
    updatedValues[updateIndex].value = this.cleanInput ? this.cleanInput(newValue) : newValue;
    this.setState({
        values: updatedValues,
    });
    this.valueChanged(reduceValues(updatedValues));
}

export function valueChanged(values) {
    this.props.onChange({
        path: this.props.path,
        value: values,
    });
}

export function renderField() {
    return (
        <div>
            {this.state.values.map(this.renderItem)}
            <Button ref="button" onClick={this.addItem}>Add item</Button>
        </div>
    );
}

export function renderItem(item, index) {
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

export function renderValue() {
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
export function shouldCollapse() {
    return this.props.collapse && !this.props.value.length;
}

export function addItemOnEnter(event) {
    if (event.keyCode === ENTER_KEYCODE) {
        this.addItem();
        event.preventDefault();
    }
}
