// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { push } from 'react-router-redux';

import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';
import Link from 'components/Link';

import { requestLogin } from 'containers/App/sagas';

import './styles.scss';

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

type Props = {
  location: Object,
  user: Object,
  requestLogin: Function,
  isLoading: boolean,
  error: string,
  push: Function,
};

type State = {
  model: {
    username: string,
    password: string,
  },
};

class LoginPage extends Component<Props, State> {
  state = {
    model: {
      username: '',
      password: '',
    },
  };
  componentWillMount() {
    if (this.props.user) {
      this.props.push('/');
    }
  }
  componentWillReceiveProps({ user, location, error }: Props) {
    if (!this.props.user && user) {
      if (location.query.redirect) {
        this.props.push(location.query.redirect);
      } else {
        this.props.push('/');
      }
    }
  }
  render() {
    return (
      <div className="login">
        <Form
          schema={schema}
          value={this.state.model}
          onChange={model => this.setState({ model })}
          onSubmit={e => this.props.requestLogin(e)}
        >
          <div className="row column mb-hg">
            <div className="text-center">
              <h2 className="c-darkest-gray t-nt">Log In Now!</h2>
            </div>
            <div className="text-center fs-mx mb-mn">
              No account?&nbsp;<Link className="fs-mx t-nt" to="/register">
                Join Now
              </Link>
            </div>
            <div className="row align-center">
              <div className="small-12 medium-6 column">
                <div className="mb-lg">
                  <label htmlFor="username">Username*</label>
                  <Field
                    className="accent"
                    name="username"
                    id="username"
                    type="text"
                  />
                  <ValidationMessage for="username" />
                </div>
                <div className="mb-lg">
                  <label htmlFor="password">Password*</label>
                  <Field
                    className="accent"
                    name="password"
                    id="password"
                    type="password"
                  />
                  <ValidationMessage for="password" />
                </div>
              </div>
            </div>
            {this.props.error && (
              <div className="text-center c-danger mb-md">
                {this.props.error}
              </div>
            )}
            <div className="text-center mb-md">
              <Button
                className="button secondary spacious"
                type="submit"
                element={Form.Button}
                isLoading={this.props.isLoading}
              >
                Sign in
              </Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = dispatch => ({
  requestLogin: payload => dispatch(requestLogin(payload)),
  push: path => dispatch(push(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
