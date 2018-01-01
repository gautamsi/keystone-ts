/**
 * THIS IS ORPHANED AND ISN'T RENDERED AT THE MOMENT
 * THIS WAS DONE TO FINISH THE REDUX INTEGRATION, WILL REWRITE SOON
 * - @mxstbr
 */

import * as React from 'react';
import { DropZoneTarget } from './ItemsTableDragDropZoneTarget';
import classnames from 'classnames';

interface Props {
    columns?: Array<any>;
    connectDropTarget?: any;
    items?: any;
    list?: any;
    currentPage?: any;
    pageSize?: number;
    drag?: any;
    dispatch?: any;
}
class ItemsTableDragDropZone extends React.Component<Props> {
    static displayName: string = 'ItemsTableDragDropZone';

    renderPageDrops() {
        const { items, currentPage, pageSize } = this.props;

        const totalPages = Math.ceil(items.count / pageSize);
        const style = { display: totalPages > 1 ? null : 'none' };

        const pages = [];
        for (let i = 0; i < totalPages; i++) {
            const page = i + 1;
            const pageItems = '' + (page * pageSize - (pageSize - 1)) + ' - ' + (page * pageSize);
            const current = (page === currentPage);
            const className = classnames('ItemList__dropzone--page', {
                'is-active': current,
            });
            pages.push(
                <DropZoneTarget
                    key={'page_' + page}
                    page={page}
                    className={className}
                    pageItems={pageItems}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    drag={this.props.drag}
                    dispatch={this.props.dispatch}
                />
            );
        }

        let cols = this.props.columns.length;
        if (this.props.list.sortable) cols++;
        if (!this.props.list.nodelete) cols++;
        return (
            <tr style={style}>
                <td colSpan={cols} >
                    <div className="ItemList__dropzone" >
                        {pages}
                        <div className="clearfix" />
                    </div>
                </td>
            </tr>
        );
    }
    render() {
        return this.renderPageDrops();
    }
}

export const DropZone = ItemsTableDragDropZone;
