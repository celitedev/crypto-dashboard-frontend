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

import saga, { reducer, logout, requestUser, requestUserBalance } from 'containers/App/sagas';

type Props = {
  user: Object,
  balance: number,
  logout: Function,
  replace: Function,
  requestUser: Function,
  requestUserBalance: Function,
  location: Object,
};

class App extends Component<Props> {
  componentWillMount() {
    if (this.props.user) {
      this.props.requestUserBalance();
    }
  }
  render() {
    const { user, balance, location: { pathname } } = this.props;
    return (
      <div>
        <Header
          user={user}
          balance={balance}
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
  balance: state.getIn(['app', 'balance']),
});

const mapDispatchToProps = dispatch => ({
  logout: type => dispatch(logout(type)),
  replace: path => dispatch(replace(path)),
  requestUser: type => dispatch(requestUser(type)),
  requestUserBalance: () => dispatch(requestUserBalance()),
});

export default compose(
  withRouter,
  injectSagas({ key: 'app', saga, reducer }),
  connect(mapStateToProps, mapDispatchToProps)
)(App);
