import * as React from 'react';
import { shallow } from 'enzyme';
import * as demand from 'must';
import { CreateForm } from '../CreateForm';
import { ModalDialog, Form } from '../../elemental';

describe('<CreateForm />', () => {
    beforeEach(() => {
        global.Keystone = {
            csrf: {
                key: 'something',
                value: 'else',
            },
        };
    });

    it('should render a Modal', () => {
        const component = shallow(<CreateForm />);
        demand(component.find(ModalDialog).length).equal(1);
    });

    it('should render a Form if it\'s open', () => {
        const component = shallow(<CreateForm />);
        demand(component.find(Form).length).equal(1);
    });
});
