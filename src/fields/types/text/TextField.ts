import { FieldBase, FieldPropsBase } from '../Field';

export class TextField extends FieldBase<FieldPropsBase> {
    static displayName: string = 'TextField';
    static type: string = 'Text';
}
