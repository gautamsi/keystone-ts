import Domify from 'react-domify';
import * as React from 'react';
import { Form } from '../../../admin/client/App/elemental';

import { ExplorerCol as Col } from './Col';
import { ExplorerRow as Row } from './Row';

export interface Props {
    FilterComponent?: any;
    FieldComponent?: any;
    value?: any;
    readmeIsVisible?: any;
    spec?: any;
    i?: any;
}

export class ExplorerFieldType extends React.Component<Props, any> {
    constructor(props) {
        super(props);
        this.state = {
            filter: this.props.FilterComponent.getDefaultValue(),
            value: this.props.value,
        };
    }
    onFieldChange(e) {
        let logValue = typeof e.value === 'string' ? `"${e.value}"` : e.value;
        console.log(`${this.props.FieldComponent.type} field value changed:`, logValue);
        this.setState({
            value: e.value,
        });
    }
    onFilterChange(value) {
        console.log(`${this.props.FieldComponent.type} filter value changed:`, value);
        this.setState({
            filter: value,
        });
    }
    render() {
        const { FieldComponent, FilterComponent, readmeIsVisible, spec } = this.props;
        const className = this.props.i ? 'fx-page__field__bordered' : undefined;
        return (
            <div className={className}>
                <Form variant="horizontal" component="div">
                    <Row isCollapsed={readmeIsVisible}>
                        <Col width={readmeIsVisible ? 300 : null} style={{ minWidth: 300, maxWidth: 640 } as any}>
                            <FieldComponent
                                {...spec}
                                onChange={this.onFieldChange}
                                value={this.state.value}
                            />
                        </Col>
                        <Col>
                            <Domify
                                className="Domify"
                                value={{ value: this.state.value }}
                            />
                        </Col>
                    </Row>
                </Form>
                <div className="fx-page__filter">
                    <div className="fx-page__filter__title">Filter</div>
                    <Row>
                        <Col width={300}>
                            <FilterComponent
                                field={spec}
                                filter={this.state.filter}
                                onChange={this.onFilterChange}
                            />
                        </Col>
                        <Col>
                            <div style={{ marginLeft: 30 }}>
                                <Domify
                                    className="Domify"
                                    value={this.state.filter}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
