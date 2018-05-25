// @flow

import * as React from 'react';
import Link from 'components/Link';
import cx from 'classnames';
import type { Map } from 'immutable';

import Button from 'components/Button';

import './styles.scss';

type Props = {
  user: Object,
  logout: Function,
  replace: Function,
  pathname: string,
};

class Header extends React.Component<Props> {
  componentWillReceiveProps({ user, replace }: Props) {
    if (this.props.user && !user) {
      replace('/');
    }
  }
  render() {
    const { user, logout, replace, pathname } = this.props;
    const className = cx('header container');
    const authRoute =
      pathname.includes('login') || pathname.includes('register');
    return (
      <div className={className}>
        <div className="header__topLine row align-middle">
          <div className="small-order-2 shrink column">
            <h1>MyCrypto.com</h1>
          </div>
          {!authRoute && (
            <div className="small-order-3 medium-order-4 column text-right">
              {user ? (
                <div>
                  <Link onClick={() => logout()}>Log out</Link>
                </div>
              ) : (
                <div className="text-right">
                  <Button
                    className="header__authBtn small secondary hollow mb-sm"
                    element={Link}
                    to="/login"
                  >
                    Login
                  </Button>
                  <Button
                    className="header__authBtn small secondary ml-mn"
                    element={Link}
                    to="/register"
                  >
                    Join
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Header;
