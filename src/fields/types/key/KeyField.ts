import { FieldBase, FieldPropsBase } from '../FieldBase';

export class KeyField extends FieldBase<FieldPropsBase> {
    static displayName: string = 'KeyField';

    static type: string = 'Key';
}
