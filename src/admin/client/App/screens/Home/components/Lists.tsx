import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';

import { plural } from '../../../../utils/string';
import { ListTile } from './ListTile';

interface IListsProps {
    counts: any;
    lists: Array<any> | object;
    spinner: React.ReactNode;
    listsData?: any;
}
export class Lists extends React.Component<IListsProps> {
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


    static propTypes = {
        counts: React.PropTypes.object.isRequired,
        lists: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object,
        ]).isRequired,
        spinner: React.PropTypes.node,
    };
}

export default connect((state: any) => {
    return {
        listsData: state.lists.data,
    };
})(Lists as any);
