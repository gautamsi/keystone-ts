import * as classnames from 'classnames';
import { evalDependsOn } from '../utils/evalDependsOn';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { FormField, FormInput, FormNote } from '../../admin/client/App/elemental';
import * as blacklist from 'blacklist';
import { CollapsedFieldLabel } from '../components/CollapsedFieldLabel';

function isObject(arg) {
    return Object.prototype.toString.call(arg) === '[object Object]';
}

// function validateSpec(spec) {
//     if (!spec) spec = {};
//     if (!isObject(spec.supports)) {
//         spec.supports = {};
//     }
//     if (!spec.focusTargetRef) {
//         spec.focusTargetRef = 'focusTarget';
//     }
//     return spec;
// }

// const Base = {
//     getInitialState() {
//         return {};
//     },
//     getDefaultProps() {
//         return {
//             adminPath: Keystone.adminPath,
//             inputProps: {},
//             labelProps: {},
//             valueProps: {},
//             size: 'full',
//         };
//     },
//     getInputName(path) {
//         // This correctly creates the path for field inputs, and supports the
//         // inputNamePrefix prop that is required for nested fields to work
//         return this.props.inputNamePrefix
//             ? `${this.props.inputNamePrefix}[${path}]`
//             : path;
//     },
//     valueChanged(event) {
//         this.props.onChange({
//             path: this.props.path,
//             value: event.target.value,
//         });
//     },
//     shouldCollapse() {
//         return this.props.collapse && !this.props.value;
//     },
//     shouldRenderField() {
//         if (this.props.mode === 'create') return true;
//         return !this.props.noedit;
//     },
//     focus() {
//         if (!this.refs[this.spec.focusTargetRef]) return;
//         findDOMNode<HTMLElement>(this.refs[this.spec.focusTargetRef]).focus();
//     },
//     renderNote() {
//         if (!this.props.note) return null;

//         return <FormNote html={this.props.note} />;
//     },
//     renderField() {
//         const { autoFocus, value, inputProps } = this.props;
//         return (
//             <FormInput {...{
//                 ...inputProps,
//                 autoFocus,
//                 autoComplete: 'off',
//                 name: this.getInputName(this.props.path),
//                 onChange: this.valueChanged,
//                 ref: 'focusTarget',
//                 value,
//             }} />
//         );
//     },
//     renderValue() {
//         return <FormInput noedit>{this.props.value}</FormInput>;
//     },
//     renderUI() {
//         let wrapperClassName = classnames(
//             'field-type-' + this.props.type,
//             this.props.className,
//             { 'field-monospace': this.props.monospace }
//         );
//         return (
//             <FormField htmlFor={this.props.path} label={this.props.label} className={wrapperClassName} cropLabel>
//                 <div className={'FormField__inner field-size-' + this.props.size}>
//                     {this.shouldRenderField() ? this.renderField() : this.renderValue()}
//                 </div>
//                 {this.renderNote()}
//             </FormField>
//         );
//     },
// };

// const Mixins = {
//     Collapse: {
//         componentWillMount() {
//             this.setState({
//                 isCollapsed: this.shouldCollapse(),
//             });
//         },
//         componentDidUpdate(prevProps, prevState) {
//             if (prevState.isCollapsed && !this.state.isCollapsed) {
//                 this.focus();
//             }
//         },
//         uncollapse() {
//             this.setState({
//                 isCollapsed: false,
//             });
//         },
//         renderCollapse() {
//             if (!this.shouldRenderField()) return null;
//             return (
//                 <FormField>
//                     <CollapsedFieldLabel onClick={this.uncollapse}>+ Add {this.props.label.toLowerCase()}</CollapsedFieldLabel>
//                 </FormField>
//             );
//         },
//     },
// };

// function create(spec) {

//     spec = validateSpec(spec);

//     let field = {
//         spec: spec,
//         displayName: spec.displayName,
//         mixins: [Mixins.Collapse],
//         statics: {
//             getDefaultValue: function (field) {
//                 return field.defaultValue || '';
//             },
//         },
//         render() {
//             if (!evalDependsOn(this.props.dependsOn, this.props.values)) {
//                 return null;
//             }
//             if (this.state.isCollapsed) {
//                 return this.renderCollapse();
//             }
//             return this.renderUI();
//         },
//     };

//     if (spec.statics) {
//         Object.assign(field.statics, spec.statics);
//     }

//     let excludeBaseMethods = {};
//     if (spec.mixins) {
//         spec.mixins.forEach(function (mixin) {
//             Object.keys(mixin).forEach(function (name) {
//                 if (Base[name]) {
//                     excludeBaseMethods[name] = true;
//                 }
//             });
//         });
//     }

//     Object.assign(field, blacklist(Base, excludeBaseMethods));
//     Object.assign(field, blacklist(spec, 'mixins', 'statics'));

//     if (Array.isArray(spec.mixins)) {
//         field.mixins = field.mixins.concat(spec.mixins);
//     }

//     return React.createClass(field);

// }

export interface FieldPropsBase {
    autoFocus?: any;
    value?: any;
    inputProps?: any;
    onChange?: any;
    mode?: any;
    noedit?: boolean;
    collapse?: any;
    path?: any;
    inputNamePrefix?: any;
    note?: any;
    className?: any;
    monospace?: any;
    type?: any;
    size?: any;
    label?: string;
    dependsOn?: any;
    values?: any;
}
export abstract class FieldBase<T extends FieldPropsBase> extends React.Component<T, any> {
    focusTargetRef: string = 'focusTarget';
    supports?: any = {};
    constructor(props) {
        super(props);
        this.state = {};

    }
    static getDefaultValue(field: any) {
        return field.defaultValue || '';
    }

    static get defaultProps() {
        return {
            adminPath: Keystone.adminPath,
            inputProps: {},
            labelProps: {},
            valueProps: {},
            size: 'full',
        };
    }
    getInputName = (path) => {
        // This correctly creates the path for field inputs, and supports the
        // inputNamePrefix prop that is required for nested fields to work
        return this.props.inputNamePrefix
            ? `${this.props.inputNamePrefix}[${path}]`
            : path;
    };
    valueChanged = (event) => {
        this.props.onChange({
            path: this.props.path,
            value: event.target.value,
        });
    };
    shouldCollapse() {
        return this.props.collapse && !this.props.value;
    }
    shouldRenderField() {
        if (this.props.mode === 'create') return true;
        return !this.props.noedit;
    }
    focus() {
        if (!this.refs[this.focusTargetRef]) return;
        findDOMNode<HTMLElement>(this.refs[this.focusTargetRef]).focus();
    }
    renderNote() {
        if (!this.props.note) return null;

        return <FormNote html={this.props.note} />;
    }
    renderField() {
        const { autoFocus, value, inputProps } = this.props;
        return (
            <FormInput {...{
                ...(inputProps as any),
                autoFocus,
                autoComplete: 'off',
                name: this.getInputName(this.props.path),
                onChange: this.valueChanged,
                ref: 'focusTarget',
                value,
            }} />
        );
    }
    renderValue() {
        return <FormInput noedit>{this.props.value}</FormInput>;
    }
    renderUI() {
        let wrapperClassName = classnames(
            'field-type-' + this.props.type,
            this.props.className,
            { 'field-monospace': this.props.monospace }
        );
        return (
            <FormField htmlFor={this.props.path} label={this.props.label} className={wrapperClassName} cropLabel>
                <div className={'FormField__inner field-size-' + this.props.size}>
                    {this.shouldRenderField() ? this.renderField() : this.renderValue()}
                </div>
                {this.renderNote()}
            </FormField>
        );
    }

    componentWillMount() {
        this.setState({
            isCollapsed: this.shouldCollapse(),
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.isCollapsed && !this.state.isCollapsed) {
            this.focus();
        }
    }
    uncollapse = () => {
        this.setState({
            isCollapsed: false,
        });
    };
    renderCollapse() {
        if (!this.shouldRenderField()) return null;
        return (
            <FormField>
                <CollapsedFieldLabel onClick={this.uncollapse}>+ Add {this.props.label.toLowerCase()}</CollapsedFieldLabel>
            </FormField>
        );
    }
    render() {
        if (!evalDependsOn(this.props.dependsOn, this.props.values)) {
            return null;
        }
        if (this.state.isCollapsed) {
            return this.renderCollapse();
        }
        return this.renderUI();
    }
}

