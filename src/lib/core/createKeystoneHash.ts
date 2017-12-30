import * as crypto from 'crypto';
import * as _ from 'lodash';

export function createKeystoneHash() {
    const hash = crypto.createHash('md5');
    hash.update(this.version);

    _.forEach(this.lists, function (list, key) {
        hash.update(JSON.stringify(list.getOptions()));
    });

    return hash.digest('hex').slice(0, 6);
}
