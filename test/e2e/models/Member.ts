import { Keystone, List } from '../../../src/index';
import { User } from './User';

export let Member = new Keystone.List('Member', {
    inherits: User,
    track: true,
});

Member.register();
