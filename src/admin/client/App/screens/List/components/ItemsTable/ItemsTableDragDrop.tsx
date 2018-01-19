import * as React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { SortableTableRow } from './ItemsTableRow';
import { DropZone } from './ItemsTableDragDropZone';

export interface Props {
    columns?: Array<any>;
    id?: any;
    index?: number;
    items?: any;
    list?: any;
    drag?: any;
    dispatch?: any;
}

class ItemsTableDragDrop extends React.Component<Props> {
    static displayName: string = 'ItemsTableDragDrop';

    render() {
        return (
            <tbody >
                {this.props.items.results.map((item, i) => {
                    return (
                        <SortableTableRow key={item.id}
                            index={i}
                            sortOrder={item.sortOrder || 0}
                            id={item.id}
                            item={item}
                            {...this.props}
                        />
                    );
                })}
                <DropZone {...this.props} />
            </tbody>
        );
    }
}

export const DragDrop = DragDropContext(HTML5Backend)(ItemsTableDragDrop);
