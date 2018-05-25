// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';

import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';
import Link from 'components/Link';

import {
  USERNAME_SCHEMA,
  USERNAME_MIN_CHAR,
  USERNAME_MAX_CHAR,
} from 'utils/constants';

const schema = yup.object({
  username: USERNAME_SCHEMA,
  email: yup
    .string()
    .email()
    .required(),
  password1: yup
    .string()
    .min(6, 'minimum password length is 6 characters')
    .required(),
});

type Props = {
  requestRegister: Function,
  isLoading: boolean,
  error: string,
  user: Object,
  replace: Function,
  redirectTo?: string,
  showMessage?: boolean,
};

type State = {
  model: Object,
};
class RegisterForm extends Component<Props, State> {
  static defaultProps = {
    showMagazineReferrer: false,
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      model: {
        username: '',
        email: '',
        password1: '',
      },
    };
  }
  componentWillMount() {
    if (this.props.redirectTo && this.props.user) {
      this.props.replace(this.props.redirectTo);
    }
  }
  componentWillReceiveProps({ user }: Props) {
    if (this.props.redirectTo && !this.props.user && user) {
      this.props.replace(this.props.redirectTo);
    }
  }
  render() {
    const {
      isLoading,
      error,
      user,
      showMessage = true,
      redirectTo = '',
    } = this.props;
    return (
      <Form
        context={{ user }}
        schema={schema}
        value={this.state.model}
        onChange={model => this.setState({ model })}
        onSubmit={e => this.props.requestRegister(e)}
      >
        <div className="row column mb-md">
          <div className="text-center">
            <h2 className="c-darkest-gray t-nt">Sign Up Now!</h2>
          </div>
          <div className="text-center fs-mx mb-mn">
            Already a member?&nbsp;<Link
              className="fs-mx t-nt"
              to={redirectTo ? `/login?redirect=${redirectTo}` : '/login'}
            >
              Login
            </Link>
          </div>
          <div className="row centered mb-lg">
            <div className="small-12 medium-8 medium-offset-2 column center">
              <div className="register__formField">
                <label htmlFor="email">Email address*</label>
                <Field
                  className="accent"
                  name="email"
                  id="email"
                  type="email"
                />
                <div className="fs-tn">
                  We’ll never share your email publicly
                </div>
                <ValidationMessage for="email" />
              </div>
              <div className="register__formField">
                <label htmlFor="username">Username*</label>
                <Field
                  className="accent"
                  name="username"
                  id="username"
                  type="text"
                />
                <div className="fs-tn">
                  A unique name between {USERNAME_MIN_CHAR} and
                  {USERNAME_MAX_CHAR} characters
                </div>
                <ValidationMessage for="username" />
              </div>
              <div className="register__formField">
                <label htmlFor="password1">Password*</label>
                <Field
                  className="accent"
                  name="password1"
                  id="password1"
                  type="password"
                />
                <div className="fs-tn">At least 6 characters</div>
                <ValidationMessage for="password1" />
              </div>
            </div>
          </div>
          <div className="text-center c-danger mb-md">{error}</div>
          <div className="text-center">
            <Button
              className="button secondary spacious"
              type="submit"
              element={Form.Button}
              isLoading={isLoading}
            >
              Register now
            </Button>
          </div>
          {showMessage &&
            user && (
              <div className="text-center mt-xl">
                <div className="mb-md">You have successfully registered.</div>
              </div>
            )}
        </div>
      </Form>
    );
  }
}

export default RegisterForm;
