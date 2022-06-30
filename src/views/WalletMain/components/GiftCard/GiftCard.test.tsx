import React from 'react';

import GiftCard, { Props } from './GiftCard';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

describe('Gift Card', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      name: 'brand',
      value: '15.00',
      onPress: jest.fn(),
      cardBalance: 15,
      cardBalanceCheckDt: null,
      purchaseTs: null,
      brandLogo: '',
      faceplateUrl: ''
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<GiftCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not render balance date if checkBalanceDate and purchaseTs are not null and equal ', () => {
    props.cardBalanceCheckDt = '2020-07-20T00:00:00.000Z';
    props.purchaseTs = '2020-07-20T00:00:00.000Z';
    const { queryByTestId } = renderWithGlobalContext(<GiftCard {...props} />);
    expect(queryByTestId('gift-card-balance-date')).toBeNull();
  });

  it('should render balance date if checkBalanceDate and purchaseTs are not null and not equal ', () => {
    props.cardBalanceCheckDt = '2020-07-20T14:00:00.000Z';
    props.purchaseTs = '2020-07-10T00:00:00.000Z';
    const { queryByTestId } = renderWithGlobalContext(<GiftCard {...props} />);
    expect(queryByTestId('gift-card-balance-date')).toBeTruthy();
  });

  it('should render card balance value if cardBalance is not null', () => {
    const { getByTestId } = renderWithGlobalContext(<GiftCard {...props} />);
    expect(getByTestId('gift-card-card-balance').props.children[1]).toEqual('15');
  });

  it('should render card value if cardBalance is null', () => {
    props.cardBalance = null;
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<GiftCard {...props} />);
    expect(queryByTestId('gift-card-card-balance')).toBeNull();
    expect(getByTestId('gift-card-card-value').props.children[1]).toEqual('15');
  });

  it('should not render any value if cardBalance and value are null', () => {
    props.value = null;
    props.cardBalance = null;
    const { queryByTestId } = renderWithGlobalContext(<GiftCard {...props} />);
    expect(queryByTestId('gift-card-card-balance')).toBeNull();
    expect(queryByTestId('gift-card-card-value')).toBeNull();
  });
});
