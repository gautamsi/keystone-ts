/**
 * This is the main entry file, which we compile the main JS bundle from. It
 * only contains the client side routing setup.
 */

// Needed for ES6 generators (redux-saga) to work
import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, browserHistory, IndexRoute } from 'react-router';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux';

import { App } from './App';
import { Home } from './screens/Home';
import { Item } from './screens/Item';
import { List } from './screens/List';

import { store, history } from './store';

// Sync the browser history to the Redux store
// const history = syncHistoryWithStore(createHistory(), store);


// Initialise Keystone.User list
import { listsByKey } from '../utils/lists';
Keystone.User = listsByKey[Keystone.userList];

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            {/* <div> */}
            <Route path={Keystone.adminPath + '/'} component={App}/>
            {/* <App history={history} /> */}
            {/* </Route> */}
            {/* </div> */}
        </ConnectedRouter>
    </Provider>,
    document.getElementById('react-root')
);
