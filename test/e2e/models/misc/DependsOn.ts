import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

// Model to demonstrate issue #2929

export let DependsOn = new Keystone.List('DependsOn', {
    autokey: {
        path: 'key',
        from: 'name',
        unique: true,
    },
    track: true,
});

DependsOn.add({
    dependency: { type: Boolean, initial: true, default: false },
    dependent:
        {
            type: Types.Select,
            options: ['spam', 'ham'],
            initial: true,
            dependsOn: { dependency: false }
        }
});

DependsOn.register();
