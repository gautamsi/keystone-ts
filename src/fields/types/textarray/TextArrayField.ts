import { ArrayFieldBase, ArrayFieldPropsBase } from '../ArrayFieldBase';

export class TextArrayField extends ArrayFieldBase<ArrayFieldPropsBase> {
    static displayName: string = 'TextArrayField';
    static type: string = 'TextArray';
}
