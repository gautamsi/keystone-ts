import { FieldBase, FieldPropsBase } from '../Field';

export class KeyField extends FieldBase<FieldPropsBase> {
    static displayName: string = 'KeyField';

    static type: string = 'Key';
}
