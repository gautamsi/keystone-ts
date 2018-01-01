import * as React from 'react';
import { findDOMNode } from 'react-dom';
import Transition from 'react-transition-group/Transition';
import classnames from 'classnames';
import { ListFiltersAddForm } from './ListFiltersAddForm';
import { Popout } from '../../../../shared/Popout';
import { PopoutList } from '../../../../shared/Popout/PopoutList';
import { FormInput } from 'elemental';
import { ListHeaderButton } from '../ListHeaderButton';

import { setFilter } from '../../actions';

export class ListFiltersAdd extends React.Component<{ maxHeight?: number, dispatch?: any, activeFilters?: any, availableFilters?: any }, any> {
    static displayName: string = 'ListFiltersAdd';

    static defaultProps() {
        return {
            maxHeight: 360,
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            innerHeight: 0,
            isOpen: false,
            searchString: '',
            selectedField: false,
        };
    }
    updateSearch(e) {
        this.setState({ searchString: e.target.value });
    }
    openPopout() {
        this.setState({ isOpen: true }, this.focusSearch);
    }
    closePopout() {
        this.setState({
            innerHeight: 0,
            isOpen: false,
            searchString: '',
            selectedField: false,
        });
    }
    setPopoutHeight(height) {
        this.setState({ innerHeight: Math.min(this.props.maxHeight, height) });
    }
    navigateBack() {
        this.setState({
            selectedField: false,
            searchString: '',
            innerHeight: 0,
        }, this.focusSearch);
    }
    focusSearch() {
        findDOMNode<HTMLElement>(this.refs.search).focus();
    }
    selectField(field) {
        this.setState({
            selectedField: field,
        });
    }
    applyFilter(value) {
        this.props.dispatch(setFilter(this.state.selectedField.path, value));
        this.closePopout();
    }
    renderList() {
        const activeFilterFields = this.props.activeFilters.map(obj => obj.field);
        const activeFilterPaths = activeFilterFields.map(obj => obj.path);
        const { searchString } = this.state;
        let filteredFilters = this.props.availableFilters;

        if (searchString) {
            filteredFilters = filteredFilters
                .filter(filter => filter.type !== 'heading')
                .filter(filter => new RegExp(searchString)
                    .test(filter.field.label.toLowerCase()));
        }

        const popoutList = filteredFilters.map((el, i) => {
            if (el.type === 'heading') {
                return (
                    <PopoutList.Heading key={'heading_' + i}>
                        {el.content}
                    </PopoutList.Heading>
                );
            }

            const filterIsActive = activeFilterPaths.length && (activeFilterPaths.indexOf(el.field.path) > -1);

            return (
                <PopoutList.Item
                    key={'item_' + el.field.path}
                    icon={filterIsActive ? 'check' : 'chevron-right'}
                    iconHover={filterIsActive ? 'check' : 'chevron-right'}
                    isSelected={!!filterIsActive}
                    label={el.field.label}
                    onClick={() => { this.selectField(el.field); }} />
            );
        });

        const formFieldStyles = {
            borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
            marginBottom: '1em',
            paddingBottom: '1em',
        };

        return (
            <Popout.Pane onLayout={this.setPopoutHeight} key="list">
                <Popout.Body>
                    <div style={formFieldStyles}>
                        <FormInput
                            onChange={this.updateSearch}
                            placeholder="Find a filter..."
                            ref="search"
                            value={this.state.searchString}
                        />
                    </div>
                    {popoutList}
                </Popout.Body>
            </Popout.Pane>
        );
    }
    renderForm() {
        return (
            <Popout.Pane onLayout={this.setPopoutHeight} key="form">
                <ListFiltersAddForm
                    activeFilters={this.props.activeFilters}
                    field={this.state.selectedField}
                    onApply={this.applyFilter}
                    onCancel={this.closePopout}
                    onBack={this.navigateBack}
                    maxHeight={this.props.maxHeight}
                    onHeightChange={this.setPopoutHeight}
                    dispatch={this.props.dispatch}
                />
            </Popout.Pane>
        );
    }
    render() {
        const { isOpen, selectedField } = this.state;
        const popoutBodyStyle = this.state.innerHeight
            ? { height: this.state.innerHeight }
            : null;
        const popoutPanesClassname = classnames('Popout__panes', {
            'Popout__scrollable-area': !selectedField,
        });

        return (
            <div>
                <ListHeaderButton
                    active={isOpen}
                    glyph="eye"
                    id="listHeaderFilterButton"
                    label="Filter"
                    onClick={isOpen ? this.closePopout : this.openPopout}
                />
                <Popout isOpen={isOpen} onCancel={this.closePopout} relativeToID="listHeaderFilterButton">
                    <Popout.Header
                        leftAction={selectedField ? this.navigateBack : null}
                        leftIcon={selectedField ? 'chevron-left' : null}
                        title={selectedField ? selectedField.label : 'Filter'}
                        transitionDirection={selectedField ? 'next' : 'prev'} />
                    <Transition
                        className={popoutPanesClassname}
                        component="div"
                        style={popoutBodyStyle}
                        classNames={selectedField ? 'Popout__pane-next' : 'Popout__pane-prev'}
                        timeout={360}
                    >
                        {selectedField ? this.renderForm() : this.renderList()}
                    </Transition>
                </Popout>
            </div>
        );
    }
}
