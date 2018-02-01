import { Keystone, FieldTypes as Types, List } from '../../src/index';


// Simple model
let DependsOn = new Keystone.List('DependsOn', {
    autokey: { path: 'slug', from: 'title', unique: true },
});

// Add index
DependsOn.add({
    title: { type: String, required: true, default: '' },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft' },
    publishedDate: { type: Types.Date, dependsOn: {state: 'published'}, required: true, initial: false },
});

DependsOn.register();
