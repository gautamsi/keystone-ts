import { keystone, Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let File = new Keystone.List('File', {
    autokey: {
        path: 'key',
        from: 'name',
        unique: true,
    },
    track: true,
});

let localStorage = new Keystone.Storage({
    adapter: Keystone.Storage.Adapters.FS,
    fs: {
        path: 'data/files',
        publicPath: '/files',
    },
});

File.add({
    name: {
        type: String,
        initial: true,
        required: true,
        index: true,
    },
    fieldA: {
        type: Types.File,
        storage: localStorage,
    },
    fieldB: {
        type: Types.File,
        storage: localStorage,
    },
});

File.defaultColumns = 'name, fieldA, fieldB';
File.register();
