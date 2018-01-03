import { ArrayFieldBase, ArrayFieldPropsBase } from '../ArrayFieldBase';

export class NumberArrayField extends ArrayFieldBase<ArrayFieldPropsBase> {

    static displayName: string = 'NumberArrayField';
    static type: string = 'NumberArray';

    cleanInput = (input) => {
        return input.replace(/[^\d]/g, '');
    }
}
