import * as React from 'react';
import {
    Button,
    GlyphButton,
    InlineGroup as Group,
    InlineGroupSection as Section,
    Spinner,
} from 'elemental';

export function ListManagement({
	checkedItemCount,
    handleDelete,
    handleSelect,
    handleToggle,
    isOpen,
    itemCount,
    itemsPerPage,
    nodelete,
    noedit,
    selectAllItemsLoading,
    ...props
}) {
    // do not render if there's no results
    // or if edit/delete unavailable on the list
    if (!itemCount || (nodelete && noedit)) return null;

    const buttonNoteStyles = { color: '#999', fontWeight: 'normal' };

    // delete button
    const actionButtons = isOpen && (
        <Section>
            <GlyphButton
                color="cancel"
                disabled={!checkedItemCount}
                glyph="trashcan"
                onClick={handleDelete}
                position="left"
                variant="link">
                Delete
			</GlyphButton>
        </Section>
    );

    // select buttons
    const allVisibleButtonIsActive = checkedItemCount === itemCount;
    const pageVisibleButtonIsActive = checkedItemCount === itemsPerPage;
    const noneButtonIsActive = !checkedItemCount;
    const selectAllButton = itemCount > itemsPerPage && (
        <Section>
            <Button
                active={allVisibleButtonIsActive}
                onClick={() => handleSelect('all')}
                title="Select all rows (including those not visible)">
                {selectAllItemsLoading ? <Spinner /> : 'All'} <small style={buttonNoteStyles}>({itemCount})</small>
            </Button>
        </Section>
    );

    const selectButtons = isOpen ? (
        <Section>
            <Group contiguous>
                {selectAllButton}
                <Section>
                    <Button active={pageVisibleButtonIsActive} onClick={() => handleSelect('visible')} title="Select all rows">
                        {itemCount > itemsPerPage ? 'Page ' : 'All '}
                        <small style={buttonNoteStyles}>({itemCount > itemsPerPage ? itemsPerPage : itemCount})</small>
                    </Button>
                </Section>
                <Section>
                    <Button active={noneButtonIsActive} onClick={() => handleSelect('none')} title="Deselect all rows">None</Button>
                </Section>
            </Group>
        </Section>
    ) : null;

    // selected count text
    const selectedCountText = isOpen ? (
        <Section>
            <span style={{ color: '#666', display: 'inline-block', lineHeight: '2.4em', margin: 1 }}>
                {checkedItemCount} selected
			</span>
        </Section>
    ) : null;

    // put it all together
    return (
        <div>
            <Group style={{ float: 'left', marginRight: '.75em', marginBottom: 0 }}>
                <Section>
                    <Button active={isOpen} onClick={() => handleToggle(!isOpen)}>
                        Manage
					</Button>
                </Section>
                {selectButtons}
                {actionButtons}
                {selectedCountText}
            </Group>
        </div>
    );
}

ListManagement['propTypes'] = {
    checkedItems: React.PropTypes.number,
    handleDelete: React.PropTypes.func.isRequired,
    handleSelect: React.PropTypes.func.isRequired,
    handleToggle: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool,
    itemCount: React.PropTypes.number,
    itemsPerPage: React.PropTypes.number,
    nodelete: React.PropTypes.bool,
    noedit: React.PropTypes.bool,
    selectAllItemsLoading: React.PropTypes.bool,
};
