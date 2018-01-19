import * as React from 'react';

import {
    FormField,
    FormInput,
    Grid,
    SegmentedControl,
} from '../../../admin/client/App/elemental';

const DISTANCE_OPTIONS = [
    { label: 'Max distance (km)', value: 'max' },
    { label: 'Min distance (km)', value: 'min' },
];

export interface Props {
    filter?: {
        lat?: number,
        lon?: number,
        distance?: {
            mode?: string,
            value?: number,
        };
    };
    onChange?: any;
}

export class TextFilter extends React.Component<Props> {

    static getDefaultValue() {
        return {
            lat: undefined,
            lon: undefined,
            distance: {
                mode: DISTANCE_OPTIONS[0].value,
                value: undefined,
            },
        };
    }

    static get defaultProps() {
        return {
            filter: this.getDefaultValue(),
        };
    }
    updateFilter(value) {
        this.props.onChange({ ...this.props.filter, ...value });
    }
    changeLat = (evt) => {
        this.updateFilter({ lat: evt.target.value });
    };
    changeLon = (evt) => {
        this.updateFilter({ lon: evt.target.value });
    };
    changeDistanceValue = (evt) => {
        this.updateFilter({
            distance: {
                mode: this.props.filter.distance.mode,
                value: evt.target.value,
            },
        });
    };
    changeDistanceMode = (mode) => {
        this.updateFilter({
            distance: {
                mode,
                value: this.props.filter.distance.value,
            },
        });
    };
    render() {
        const { filter } = this.props;
        const distanceModeVerb = filter.distance.mode === 'max' ? 'Maximum' : 'Minimum';

        return (
            <div>
                <Grid.Row xsmall="one-half" gutter={10}>
                    <Grid.Col>
                        <FormField label="Latitude" >
                            <FormInput
                                autoFocus
                                onChange={this.changeLat}
                                placeholder={'Latitude'}
                                ref="latitude"
                                required="true"
                                step={0.01}
                                type="number"
                                value={filter.lat}
                            />
                        </FormField>
                    </Grid.Col>
                    <Grid.Col>
                        <FormField label="Longitude">
                            <FormInput
                                onChange={this.changeLon}
                                placeholder={'Longitude'}
                                ref="longitude"
                                required="true"
                                step={0.01}
                                type="number"
                                value={filter.lon}
                            />
                        </FormField>
                    </Grid.Col>
                </Grid.Row>
                <FormField>
                    <SegmentedControl
                        equalWidthSegments
                        onChange={this.changeDistanceMode}
                        options={DISTANCE_OPTIONS}
                        value={this.props.filter.distance.mode}
                    />
                </FormField>
                <FormInput
                    onChange={this.changeDistanceValue}
                    placeholder={distanceModeVerb + ' distance from point'}
                    ref="distance"
                    type="number"
                    value={filter.distance.value}
                />
            </div>
        );
    }
}
