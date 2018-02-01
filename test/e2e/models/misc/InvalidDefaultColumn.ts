// THIS MODEL IS USED TO MAKE SURE INVALID DEFAULT COLUMNS ARE PROPERLY WARNED ABOUT
import { Keystone, List } from '../../../../src/index';

let InvalidDefaultColumn = new Keystone.List('InvalidDefaultColumn', {});

// THIS SHOULD CAUSE THE FOLLOWING WARNING TO BE GENERATED IN THE ADMIN UI CONSOLE:
// 'List InvalidDefaultColumn specified an invalid default column: bar'
InvalidDefaultColumn.add({
    foo: { type: String }
});

InvalidDefaultColumn.defaultColumns = 'bar';
InvalidDefaultColumn.register();

export = InvalidDefaultColumn;
