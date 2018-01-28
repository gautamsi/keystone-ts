import * as React from 'react';
import { shallow } from 'enzyme';
import * as demand from 'must';
import { SigninView as Signin } from '../Signin';

import { Brand } from '../components/Brand';
import { LoginForm } from '../components/LoginForm';

describe('<Signin />', () => {
    before(() => {
        // @ts-ignore
        global.window = {
            location: {},
        };
    });

    it('should render a div', () => {
        const component = shallow(<Signin />);
        demand(component.find('div').length).gt(0);
    });

    it('should render the brand', () => {
        const component = shallow(<Signin />);
        demand(component.find(Brand).length).gt(0);
    });

    it('should render the login form', () => {
        const component = shallow(<Signin />);
        demand(component.find(LoginForm).length).gt(0);
    });
});
