// @flow

import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import { Route, PrivateRoute } from 'components/Routes';
import Load from 'components/Load';

class Routes extends Component<{}> {
  render() {
    return (
      <Switch>
        <PrivateRoute
          exact
          path="/"
          render={props => (
            <Load loader={() => import('pages/Home')} {...props} />
          )}
        />
        <Route
          path="/transactions"
          render={props => (
            <Load loader={() => import('pages/Transactions')} {...props} />
          )}
        />
        <Route
          path="/login"
          render={props => (
            <Load loader={() => import('pages/Login')} {...props} />
          )}
        />
        <Route
          path="/register"
          render={props => (
            <Load loader={() => import('pages/Register')} {...props} />
          )}
        />
        <Route
          path="/404"
          render={props => (
            <Load loader={() => import('pages/404')} {...props} />
          )}
        />
        <Redirect to="/404" /* Must be the last one */ />
      </Switch>
    );
  }
}

export default withRouter(Routes);
