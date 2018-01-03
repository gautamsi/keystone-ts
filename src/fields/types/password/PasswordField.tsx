import * as React from 'react';
import {
    Button,
    FormInput,
    InlineGroup as Group,
    InlineGroupSection as Section,
} from 'elemental';
import { FieldBase, FieldPropsBase } from '../FieldBase';

interface Props extends FieldPropsBase {
    paths?: any;
}

export class PasswordField extends FieldBase<Props> {

    static displayName: string = 'PasswordField';
    static type: string = 'Password';

    constructor(props) {
        super(props);
        this.state = {
            passwordIsSet: this.props.value ? true : false,
            showChangeUI: this.props.mode === 'create' ? true : false,
            password: '',
            confirm: '',
            ...this.state
        };
    }

    valueChanged(which, event?) { // event is not optional
        let newState = {};
        newState[which] = event.target.value;
        this.setState(newState);
    }

    showChangeUI() {
        this.setState({
            showChangeUI: true,
        }, () => this.focus());
    }

    onCancel() {
        this.setState({
            showChangeUI: false,
        }, () => this.focus());
    }

    renderValue() {
        return <FormInput noedit>{this.props.value ? 'Password Set' : ''}</FormInput>;
    }

    renderField() {
        return this.state.showChangeUI ? this.renderFields() : this.renderChangeButton();
    }

    renderFields() {
        return (
            <Group block>
                <Section grow>
                    <FormInput
                        autoComplete="off"
                        name={this.getInputName(this.props.path)}
                        onChange={this.valueChanged.bind(this, 'password')}
                        placeholder="New password"
                        ref="focusTarget"
                        type="password"
                        value={this.state.password}
                    />
                </Section>
                <Section grow>
                    <FormInput
                        autoComplete="off"
                        name={this.getInputName(this.props.paths.confirm)}
                        onChange={this.valueChanged.bind(this, 'confirm')}
                        placeholder="Confirm new password" value={this.state.confirm}
                        type="password"
                    />
                </Section>
                {this.state.passwordIsSet ? (
                    <Section>
                        <Button onClick={this.onCancel}>Cancel</Button>
                    </Section>
                ) : null}
            </Group>
        );
    }

    renderChangeButton() {
        let label = this.state.passwordIsSet
            ? 'Change Password'
            : 'Set Password';

        return (
            <Button ref="focusTarget" onClick={this.showChangeUI}>{label}</Button>
        );
    }

}
