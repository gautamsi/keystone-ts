import { Keystone, FieldTypes as Types } from '../../src/index';

// Simple model
let Post = new Keystone.List('Post', {
    autokey: { path: 'slug', from: 'title', unique: true },
});

// Add index
Post.add({
    title: { type: String, required: true, default: '' },
    content: { type: Types.Text, default: '' },
});

Post.schema.index({
    title: 'text',
    content: 'text'
}, {
        name: 'searchIndex',
        weights: {
            content: 2,
            title: 1
        }
    });

Post.register();
