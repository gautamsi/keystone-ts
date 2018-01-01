import * as React from 'react';
import {
    GlyphButton,
    InlineGroup as Group,
    InlineGroupSection as Section,
    ResponsiveText,
} from 'elemental';
import { theme } from '../../../../theme';

import { ListColumnsForm } from './ListColumnsForm';
import { ListDownloadForm } from './ListDownloadForm';
import { ListHeaderSearch } from './ListHeaderSearch';

import { ListFiltersAdd } from './Filtering/ListFiltersAdd';

const ButtonDivider: React.SFC<{ style?: any }> = ({ ...props }) => {
    props.style = {
        borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
        paddingLeft: '0.75em',
        ...props.style,
    };

    return <div {...props} />;
};

const CreateButton: React.SFC<any> = ({ listName, onClick, ...props }) => {
    return (
        <GlyphButton
            block
            color="success"
            data-e2e-list-create-button="header"
            glyph="plus"
            onClick={onClick}
            position="left"
            title={`Create ${listName}`}
            {...props}
        >
            <ResponsiveText
                visibleSM="Create"
                visibleMD="Create"
                visibleLG={`Create ${listName}`}
            />
        </GlyphButton>
    );
};

export const ListHeaderToolbar: React.SFC<Props> = ({
    // common
    dispatch,
    list,

    // expand
    expandIsActive,
    expandOnClick,

    // list
    createIsAvailable,
    createListName,
    createOnClick,

    // search
    searchHandleChange,
    searchHandleClear,
    searchHandleKeyup,
    searchValue,

    // filters
    filtersActive,
    filtersAvailable,

    // columns
    columnsAvailable,
    columnsActive,

    ...props
}) => {
    return (
        <Group block cssStyles={classes.wrapper}>
            <Section grow cssStyles={classes.search}>
                <ListHeaderSearch
                    handleChange={searchHandleChange}
                    handleClear={searchHandleClear}
                    handleKeyup={searchHandleKeyup}
                    value={searchValue}
                />
            </Section>
            <Section grow cssStyles={classes.buttons}>
                <Group block>
                    <Section cssStyles={classes.filter}>
                        <ListFiltersAdd
                            dispatch={dispatch}
                            activeFilters={filtersActive}
                            availableFilters={filtersAvailable}
                        />
                    </Section>
                    <Section cssStyles={classes.columns}>
                        <ListColumnsForm
                            availableColumns={columnsAvailable}
                            activeColumns={columnsActive}
                            dispatch={dispatch}
                        />
                    </Section>
                    <Section cssStyles={classes.download}>
                        <ListDownloadForm
                            activeColumns={columnsActive}
                            dispatch={dispatch}
                            list={list}
                        />
                    </Section>
                    <Section cssStyles={classes.expand}>
                        <ButtonDivider>
                            <GlyphButton
                                active={expandIsActive}
                                glyph="mirror"
                                onClick={expandOnClick}
                                title="Expand table width"
                            />
                        </ButtonDivider>
                    </Section>
                    {createIsAvailable && <Section cssStyles={classes.create}>
                        <ButtonDivider>
                            <CreateButton
                                listName={createListName}
                                onClick={createOnClick}
                            />
                        </ButtonDivider>
                    </Section>}
                </Group>
            </Section>
        </Group>
    );
};

interface Props {
    columnsActive?: Array<any>;
    columnsAvailable?: Array<any>;
    createIsAvailable?: boolean;
    createListName?: string;
    createOnClick: any;
    dispatch: any;
    expandIsActive?: boolean;
    expandOnClick: any;
    filtersActive?: Array<any>;
    filtersAvailable?: Array<any>;
    list?: object;
    searchHandleChange: any;
    searchHandleClear: any;
    searchHandleKeyup: any;
    searchValue?: string;
}

const tabletGrowStyles = {
    [`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
        flexGrow: 1,
    },
};

const classes = {
    // main wrapper
    wrapper: {
        [`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
            flexWrap: 'wrap',
        },
    },

    // button wrapper
    buttons: {
        [`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
            paddingLeft: 0,
        },
    },

    // cols
    expand: {
        [`@media (max-width: ${theme.breakpoint.desktopMax})`]: {
            display: 'none',
        },
    },
    filter: {
        [`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
            paddingLeft: 0,
            flexGrow: 1,
        },
    },
    columns: tabletGrowStyles,
    create: tabletGrowStyles,
    download: tabletGrowStyles,
    search: {
        [`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
            marginBottom: '0.75em',
            minWidth: '100%',
        },
    },
};
