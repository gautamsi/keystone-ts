import { create } from './create';
import { delete_ } from './delete';
import { download } from './download';
import { get } from './get';
import { update } from './update';

export const listHandler = {
    create,
    delete: delete_,
    download,
    get,
    update
};
