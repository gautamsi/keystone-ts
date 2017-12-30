import * as React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Sortable } from './RelatedItemsListRow';

class RelatedItemsListDragDrop extends React.Component {
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
RelatedItemsListDragDrop['propTypes'] = {
    columns: React.PropTypes.array.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    dragNewSortOrder: React.PropTypes.number,
    items: React.PropTypes.array.isRequired,
    list: React.PropTypes.object.isRequired,
    refList: React.PropTypes.object.isRequired,
    relatedItemId: React.PropTypes.string.isRequired,
    relationship: React.PropTypes.object.isRequired,
};

export const DragDrop = DragDropContext(HTML5Backend)(RelatedItemsListDragDrop);
