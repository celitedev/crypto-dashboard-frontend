// @flow

import React, { Component } from 'react';
import Select, { Creatable } from 'react-select';
import cx from 'classnames';
import { sortBy } from 'lodash';

import transformOptions from 'utils/transformOptions';

import Icon from 'components/Icon';
import ChevronDown from 'images/sprite/chevron-down.svg';
import ChevronUp from 'images/sprite/chevron-up.svg';

import './styles/default.scss';

type Props = {
  splitLabel?: string,
  options?: Array<string> | Array<{ value: string, label: string }>,
  className?: string,
  creatable?: boolean,
  searchable?: boolean,
  meta?: Array<string>,
  onChange?: Function,
  onClose?: Function,
  onOpen?: Function,
  arrowRenderer?: Function,
  sortAlphabetically?: boolean,
};

class CustomSelect extends Component<
  Props,
  {
    isToggled: boolean,
  }
> {
  static defaultProps = {
    searchable: false,
    sortAlphabetically: true,
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      isToggled: false,
    };
  }

  onChangeHandler = (val: string) => {
    const { onChange, meta } = this.props;
    if (onChange) onChange(val, meta);
  };

  onOpen = () => {
    this.setState({ isToggled: true });
  };

  onClose = () => {
    this.setState({ isToggled: false });
  };

  arrowRenderer = () => (
    <Icon glyph={this.state.isToggled ? ChevronUp : ChevronDown} size={10} />
  );

  render() {
    const {
      splitLabel,
      options,
      className,
      sortAlphabetically,
      creatable,
      arrowRenderer,
      onChange,
      onOpen,
      onClose,
      ...otherProps
    } = this.props;

    const containerClassName = cx('reactSelect', className, {
      'reactSelect--hasSplitLabel': splitLabel,
    });

    const transformedOptions = transformOptions(options);

    return (
      <div className={containerClassName}>
        {splitLabel && (
          <div className="reactSelect__splitLabel">{splitLabel}</div>
        )}
        {React.createElement(creatable ? Creatable : Select, {
          arrowRenderer: arrowRenderer || this.arrowRenderer,
          options: sortAlphabetically
            ? sortBy(transformedOptions, 'label')
            : transformedOptions,
          onChange: this.onChangeHandler,
          onOpen: this.onOpen,
          onClose: this.onClose,
          ...otherProps,
        })}
      </div>
    );
  }
}

export default CustomSelect;
