// @flow

import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'components/Routes';
import storage from 'store';
import { get } from 'lodash';

type Props = {
  render: Function,
  location?: Object,
};

class PrivateRoute extends PureComponent<Props> {
  render() {
    const { render: Component, ...rest } = this.props;
    const pathname = get(rest, ['location', 'pathname']);
    const isAuthenticated = storage.get('user');
    const redirect = '/login';
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: redirect,
                search: `?redirect=${pathname}`,
              }}
            />
          )}
      />
    );
  }
}

export default PrivateRoute;
