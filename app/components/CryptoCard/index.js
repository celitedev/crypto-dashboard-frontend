// @flow

import React, { Component } from 'react';
import currencyFormatter, { currencies } from 'currency-formatter';
import { toastr } from 'react-redux-toastr';

import Link from 'components/Link';

import './styles.scss';

type Props = {
  cryptoSymbol: string,
  transactions: Object,
  currencies: Object,
  sell: Function,
  makeTransaction: Function,
};

class CryptoCard extends Component<Props, {}> {
  sell = () => {
    const { cryptoSymbol } = this.props;
    const currency = this.props.currencies
      .entrySeq()
      .find(([k, c]) => c.get('symbol') === cryptoSymbol);
    if (!currency) {
      toastr.error('', 'Price is not available in the market');
    } else {
      let amount = 0;
      this.props.transactions.entrySeq().forEach(([k, t]) => {
        if (t.get('transaction_type') === 1) {
          amount += t.get('amount');
        } else {
          amount -= t.get('amount');
        }
      });
      this.props.makeTransaction({
        transaction_type: 2,
        crypto_symbol: cryptoSymbol,
        price: currency[1].getIn(['data', 'last_tick']),
        amount,
      });
    }
  };
  render() {
    const { cryptoSymbol, transactions } = this.props;
    let sum = 0;
    let amount = 0;
    transactions.entrySeq().forEach(([k, t]) => {
      if (t.get('transaction_type') === 1) {
        sum += t.get('price') * t.get('amount');
        amount += t.get('amount');
      } else {
        sum -= t.get('price') * t.get('amount');
        amount -= t.get('amount');
      }
    });
    if (amount === 0) {
      return null;
    }
    return (
      <div className="cryptoCard">
        <div className="row">
          <div className="column small-6">
            {amount}&nbsp;{cryptoSymbol}
          </div>
          <div className="column small-6 text-right">
            {currencyFormatter.format(sum, { code: 'USD' })}
            <div>
              <Link onClick={this.sell}>Sell</Link>&nbsp;&nbsp;
              <Link>View</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CryptoCard;
