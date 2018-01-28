
declare var before;
declare var it;
declare var describe;
declare var beforeEach;

declare var Keystone;
declare var keystone;

interface Error {
    type?: any;
}

interface NodeModule {
    paths?: any
}

declare namespace NodeJS {
    export interface Global {
        keystone: any;
        Keystone: any;
        window: any;
    }
}
declare var global: NodeJS.Global;