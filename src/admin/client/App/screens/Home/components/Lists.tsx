import * as React from 'react';
import * as _ from 'lodash';
import * as redux from 'react-redux';

import { plural } from '../../../../utils/string';
import { ListTile } from './ListTile';

interface Props {
    counts: any;
    lists: Array<any> | object;
    spinner: React.ReactNode;
    listsData?: any;
}
class ListsComponent extends React.Component<Props> {
    render() {
        return (
            <div className="dashboard-group__lists">
                {_.map(this.props.lists, (list, key) => {
                    // If an object is passed in the key is the index,
                    // if an array is passed in the key is at list.key
                    const listKey = list.key || key;
                    const href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;
                    const listData = this.props.listsData[list.path];
                    const isNoCreate = listData ? listData.nocreate : false;
                    return (
                        <ListTile
                            key={list.path}
                            path={list.path}
                            label={list.label}
                            hideCreateButton={isNoCreate}
                            href={href}
                            count={plural(this.props.counts[listKey], '* Item', '* Items')}
                            spinner={this.props.spinner}
                        />
                    );
                })}
            </div>
        );
    }
}

export const Lists = redux.connect<{}, Props, any>((state: any) => {
    return {
        listsData: state.lists.data,
    };
})(ListsComponent as any);
