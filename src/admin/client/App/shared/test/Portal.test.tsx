import * as React from 'react';
import { shallow } from 'enzyme';
import * as demand from 'must';
import { Portal } from '../Portal';

describe('<Portal />', () => {
    it('should return null', () => {
        const component = shallow(<Portal />);
        demand(component.type()).eql(null);
    });
});
