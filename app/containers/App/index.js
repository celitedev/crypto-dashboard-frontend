// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'react-router-redux';
import type { Map } from 'immutable';
import { withRouter } from 'react-router';

import injectSagas from 'utils/injectSagas';

import Header from 'components/Header';
import Routes from 'routes';

import saga, { reducer, logout, requestUser } from 'containers/App/sagas';

type Props = {
  user: Object,
  logout: Function,
  replace: Function,
  requestUser: Function,
  location: Object,
};

class App extends Component<Props> {
  render() {
    const { user, location: { pathname } } = this.props;
    return (
      <div>
        <Header
          user={user}
          logout={this.props.logout}
          replace={this.props.replace}
          pathname={pathname}
        />
        <Routes />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

const mapDispatchToProps = dispatch => ({
  logout: type => dispatch(logout(type)),
  replace: path => dispatch(replace(path)),
  requestUser: type => dispatch(requestUser(type)),
});

export default compose(
  withRouter,
  injectSagas({ key: 'app', saga, reducer }),
  connect(mapStateToProps, mapDispatchToProps)
)(App);
