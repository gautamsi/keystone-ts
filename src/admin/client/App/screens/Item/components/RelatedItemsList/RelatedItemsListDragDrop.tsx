import * as React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Sortable } from './RelatedItemsListRow';

export interface Props {
    columns: Array<any>;
    dispatch: any;
    dragNewSortOrder?: number;
    items: any;
    list: any;
    refList: any;
    relatedItemId: string;
    relationship: any;
}
class RelatedItemsListDragDrop extends React.Component<Props> {
    render() {
        const { items } = this.props;
        return (
            <tbody>
                {items.results.map((item, i) => {
                    return (<Sortable
                        key={item.id}
                        index={i}
                        item={item}
                        {...this.props}
                    />);
                })}
            </tbody>
        );
    }
}


export const DragDrop = DragDropContext(HTML5Backend)(RelatedItemsListDragDrop);
