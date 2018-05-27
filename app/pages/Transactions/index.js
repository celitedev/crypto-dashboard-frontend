// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { generate } from 'shortid';
import cx from 'classnames';
import moment from 'moment';
import currencyFormatter from 'currency-formatter';

import injectSagas from 'utils/injectSagas';

import saga, { reducer, requestTransaction } from 'pages/Home/sagas';

type Props = {
  isLoading: boolean,
  transactions: Object,
  requestTransaction: Function,
};
class TransactionsPage extends Component<Props, {}> {
  componentWillMount() {
    this.props.requestTransaction();
  }
  render() {
    const { transactions } = this.props;
    return (
      <div className="transactionsPage container">
        <div className="row">
          <div className="column large-7 small-12">
            <h3>Crypto Market Prices</h3>
            <div className="row">
              <div className="column small-2">Type</div>
              <div className="column small-2">Crypto</div>
              <div className="column small-2">Price</div>
              <div className="column small-2">Amount</div>
              <div className="column small-4">Date</div>
            </div>
            {transactions &&
              transactions.entrySeq().map(([key, currency]) => (
                <div className="row" key={generate()}>
                  <div
                    className={cx('column small-2', {
                      'c-green': currency.get('transaction_type') === 1,
                      'c-danger': currency.get('transaction_type') === 2,
                    })}
                  >
                    {currency.get('transaction_type') === 1 ? 'Buy' : 'Sell'}
                  </div>
                  <div className="column small-2 c-darker-gray ">
                    {currency.get('crypto_symbol')}
                  </div>
                  <div className="column small-2 c-darker-gray ">
                    {currencyFormatter.format(currency.get('price'), {
                      code: 'USD',
                    })}
                  </div>
                  <div className="column small-2 c-darker-gray ">
                    {currency.get('amount')}
                  </div>
                  <div className="column small-4 c-darker-gray ">
                    {moment(currency.get('created')).format('LLL')}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['transaction', 'transactions', 'isLoading']),
  transactions: state.getIn(['transaction', 'transactions', 'data']),
});

const mapDispatchToProps = dispatch => ({
  requestTransaction: () => dispatch(requestTransaction()),
});

export default compose(
  injectSagas({ key: 'transaction', saga, reducer }),
  connect(mapStateToProps, mapDispatchToProps)
)(TransactionsPage);
