// @flow

import React, { Component } from 'react';

import RegisterForm from 'containers/RegisterForm';

import './styles.scss';

class RegisterPage extends Component<{}> {
  render() {
    return (
      <div className="register">
        <RegisterForm redirectTo="/" />
      </div>
    );
  }
}

export default RegisterPage;
