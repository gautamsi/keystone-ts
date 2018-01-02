import { ArrayFieldBase, ArrayFieldPropsBase } from '../ArrayField';

export class TextArrayField extends ArrayFieldBase<ArrayFieldPropsBase> {
    static displayName: string = 'TextArrayField';
    static type: string = 'TextArray';
}
