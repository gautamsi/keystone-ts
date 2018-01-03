import { FieldBase, FieldPropsBase } from '../FieldBase';

export class TextField extends FieldBase<FieldPropsBase> {
    static displayName: string = 'TextField';
    static type: string = 'Text';
}
