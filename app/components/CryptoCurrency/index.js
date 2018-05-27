// @flow

import React, { Component } from 'react';
import { Layer, Line, Stage } from 'react-konva';
import { max, min } from 'lodash';
import currencyFormatter from 'currency-formatter';
import cx from 'classnames';

import Link from 'components/Link';

import './styles.scss';

type Props = {
  currency: Object,
  makeTransaction: Function,
};

type State = {
  mode: string,
  amount: number,
};
class CryptoCurreny extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'view',
      amount: 0,
    };
  }
  buy = () => {
    this.setState({
      mode: 'view',
    });
    const { currency } = this.props;
    this.props.makeTransaction({
      transaction_type: 1,
      crypto_symbol: currency.get('symbol'),
      price: currency.getIn(['data', 'last_tick']),
      amount: Number(this.state.amount),
    });
  };
  renderGraph = (prices, priceChange) => {
    const points = [];
    const graphDivHeight = 48;
    const items = prices.map(data => data.get('1')).toJS();
    const minPrice = min(items);
    const maxPrice = max(items);
    const heightRate = 48 / (maxPrice - minPrice);
    items.forEach((data, idx) => {
      points.push(idx, graphDivHeight - (data - minPrice) * heightRate);
    });

    return (
      <div className="cryptoCurrency__graph">
        <Stage width="250" height={graphDivHeight}>
          <Layer>
            <Line
              points={points}
              stroke={priceChange > 0 ? '#3eb5be' : '#cc4b37'}
              strokeWidth={1}
            />
          </Layer>
        </Stage>
      </div>
    );
  };
  render() {
    const { currency } = this.props;
    const { mode, amount } = this.state;
    const currPrice = currencyFormatter.format(
      currency.getIn(['data', 'last_tick']),
      { code: 'USD' }
    );
    const priceChange = Number(currency.getIn(['data', '24hr_change'])).toFixed(
      2
    );
    const percentageChange = Number(
      currency.getIn(['data', '24hr_change_percent'])
    ).toFixed(2);
    const prices = currency.getIn(['data', 'one_day']);
    return (
      <div className="cryptoCurrency">
        <div>
          <div className="cryptoCurrency__symbol">{currency.get('symbol')}</div>
          <div className="cryptoCurrency__name">{currency.get('name')}</div>
        </div>
        {this.renderGraph(prices, priceChange)}
        <div className="text-right">
          <div
            className={cx('cryptoCurrency__currentPrice', {
              'cryptoCurrency__currentPrice--green': priceChange > 0,
              'cryptoCurrency__currentPrice--red': priceChange < 0,
            })}
          >
            {currPrice}
          </div>
          <div
            className={cx('cryptoCurrency__priceChange', {
              'cryptoCurrency__priceChange--green': priceChange > 0,
              'cryptoCurrency__priceChange--red': priceChange < 0,
            })}
          >
            {`${priceChange > 0 ? '+$' : '-$'}${Math.abs(
              priceChange
            )} (${percentageChange}%)`}
          </div>
          <div className="cryptoCurrency__action">
            {mode === 'view' ? (
              <Link onClick={() => this.setState({ mode: 'buy' })}>Buy</Link>
            ) : (
              <div>
                <input
                  type="text"
                  value={amount}
                  onChange={e => {
                    this.setState({
                      amount: e.target.value,
                    });
                  }}
                />
                <Link onClick={() => this.buy()}>Confirm</Link>
              </div>
            )}
            &nbsp;&nbsp;
            <Link>View</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default CryptoCurreny;
