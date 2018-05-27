// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { generate } from 'shortid';
import { toastr } from 'react-redux-toastr';

import CryptoCurrency from 'components/CryptoCurrency';
import CryptoCard from 'components/CryptoCard';

import injectSagas from 'utils/injectSagas';

import saga, {
  reducer,
  requestPopularCurrencies,
  makeTransaction,
  requestTransaction,
} from './sagas';

type Props = {
  currencies: Object,
  isLoading: boolean,
  isTransactionListLoading: boolean,
  transactions: Object,
  isTransactionLoading: boolean,
  transactionError: string,
  requestPopularCurrencies: Function,
  makeTransaction: Function,
  requestTransaction: Function,
};
class HomePage extends Component<Props, {}> {
  componentWillMount() {
    this.props.requestPopularCurrencies();
    this.props.requestTransaction();
  }
  componentWillReceiveProps(newProps: Props) {
    if (
      this.props.isTransactionLoading &&
      !newProps.isTransactionLoading &&
      newProps.transactionError
    ) {
      toastr.error('', newProps.transactionError);
    }
  }
  render() {
    const { currencies, transactions } = this.props;
    return (
      <div className="homePage container">
        <div className="row">
          <div className="column large-7 small-12">
            <h3>Crypto Market Prices</h3>
            {currencies &&
              currencies
                .entrySeq()
                .map(([key, currency]) => (
                  <CryptoCurrency
                    key={generate()}
                    currency={currency}
                    makeTransaction={this.props.makeTransaction}
                  />
                ))}
          </div>
          <div className="column large-5 small-12">
            <h3>My Crypto Portfolio</h3>
            {transactions
              .groupBy(t => t.get('crypto_symbol'))
              .entrySeq()
              .map(([key, value]) => (
                <CryptoCard
                  key={generate()}
                  cryptoSymbol={key}
                  transactions={value}
                  currencies={currencies}
                  makeTransaction={this.props.makeTransaction}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['home', 'currencies', 'isLoading']),
  currencies: state.getIn(['home', 'currencies', 'data']),
  isTransactionListLoading: state.getIn(['home', 'transactions', 'isLoading']),
  transactions: state.getIn(['home', 'transactions', 'data']),
  isTransactionLoading: state.getIn(['home', 'isLoading']),
  transactionError: state.getIn(['home', 'error']),
});

const mapDispatchToProps = dispatch => ({
  requestPopularCurrencies: () => dispatch(requestPopularCurrencies()),
  makeTransaction: payload => dispatch(makeTransaction(payload)),
  requestTransaction: () => dispatch(requestTransaction()),
});

export default compose(
  injectSagas({ key: 'home', saga, reducer }),
  connect(mapStateToProps, mapDispatchToProps)
)(HomePage);
