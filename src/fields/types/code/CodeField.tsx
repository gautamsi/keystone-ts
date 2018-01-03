import * as _ from 'lodash';
import * as CodeMirror from 'codemirror';
import { FieldBase, FieldPropsBase } from '../FieldBase';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { FormInput } from 'elemental';
import * as classnames from 'classnames';

interface Props extends FieldPropsBase {
    editor?: any;
    height?: number;
}

/**
 * TODO:
 * - Remove dependency on lodash
 */

// See CodeMirror docs for API:
// http://codemirror.net/doc/manual.html


export class CodeField extends FieldBase<Props> {
    _currentCodemirrorValue: any;
    codeMirror: any;


    static displayName: string = 'CodeField';
    static type: string = 'Code';

    constructor(props) {
        super(props);
        this.state = {
            isFocused: false,
        };
    }
    componentDidMount() {
        if (!this.refs.codemirror) {
            return;
        }

        let options = _.defaults({}, this.props.editor, {
            lineNumbers: true,
            readOnly: this.shouldRenderField() ? false : true,
        });

        this.codeMirror = CodeMirror.fromTextArea(findDOMNode(this.refs.codemirror), options);
        this.codeMirror.setSize(null, this.props.height);
        this.codeMirror.on('change', this.codemirrorValueChanged);
        this.codeMirror.on('focus', this.focusChanged.bind(this, true));
        this.codeMirror.on('blur', this.focusChanged.bind(this, false));
        this._currentCodemirrorValue = this.props.value;
    }
    componentWillUnmount() {
        // todo: is there a lighter-weight way to remove the cm instance?
        if (this.codeMirror) {
            this.codeMirror.toTextArea();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.codeMirror && this._currentCodemirrorValue !== nextProps.value) {
            this.codeMirror.setValue(nextProps.value);
        }
    }
    focus() {
        if (this.codeMirror) {
            this.codeMirror.focus();
        }
    }
    focusChanged(focused) {
        this.setState({
            isFocused: focused,
        });
    }
    codemirrorValueChanged(doc, change) {
        let newValue = doc.getValue();
        this._currentCodemirrorValue = newValue;
        this.props.onChange({
            path: this.props.path,
            value: newValue,
        });
    }
    renderCodemirror() {
        const className = classnames('CodeMirror-container', {
            'is-focused': this.state.isFocused && this.shouldRenderField(),
        });

        return (
            <div className={className}>
                <FormInput
                    autoComplete="off"
                    multiline
                    name={this.getInputName(this.props.path)}
                    onChange={this.valueChanged}
                    ref="codemirror"
                    value={this.props.value}
                />
            </div>
        );
    }
    renderValue() {
        return this.renderCodemirror();
    }
    renderField() {
        return this.renderCodemirror();
    }
}
