import React from 'react';
import InStoreOffer, { Props } from './InStoreOffer';

import { renderWithGlobalContext } from '../../../../../test-utils/renderWithGlobalContext';

import { getLocalOffers_1 } from '../../../../../test-utils/entities';
import { InStoreOfferStatus } from '../../../../../models/cardLink';
import { fireEvent } from '@testing-library/react-native';
import { GeneralModel } from '../../../../../models';
import { getMockDeps } from '../../../../../test-utils/getMockDeps';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('In Store Offer', () => {
  let props: Props;
  let deps: GeneralModel.Deps;

  beforeEach(() => {
    deps = getMockDeps();
    props = {
      offer: getLocalOffers_1().offers[0],
      disabled: false,
      style: {},
      onActivatePressed: jest.fn()
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<InStoreOffer {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render when the offer is not activated', () => {
    props.offer.status = InStoreOfferStatus.INACTIVE;
    props.offer.activeUntil = '2021-08-08';
    const { toJSON } = renderWithGlobalContext(<InStoreOffer {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render when rewardValue is not provided', () => {
    props.offer.pointsAwarded.rewardValue = null;
    const { toJSON } = renderWithGlobalContext(<InStoreOffer {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should warn when the offer has invalid reward type or value (rewardValue)', () => {
    props.offer.pointsAwarded.rewardValue = null;
    renderWithGlobalContext(<InStoreOffer {...props} />, deps);
    expect(deps.logger.warn).toBeCalledWith('In Store Offer has invalid points awarded', expect.any(Object));
  });

  it('should warn when the offer has invalid reward type or value (rewardType)', () => {
    props.offer.pointsAwarded.rewardType = null;
    renderWithGlobalContext(<InStoreOffer {...props} />, deps);
    expect(deps.logger.warn).toBeCalledWith('In Store Offer has invalid points awarded', expect.any(Object));
  });

  it('should warn when the offer status is not valid', () => {
    props.offer.status = 'some unknown value' as InStoreOfferStatus;
    renderWithGlobalContext(<InStoreOffer {...props} />, deps);
    expect(deps.logger.warn).toBeCalledWith('In Store Offer has invalid status', expect.any(Object));
  });

  it('should call onActivatePressed function', () => {
    props.offer.status = InStoreOfferStatus.INACTIVE;
    const { getByTestId } = renderWithGlobalContext(<InStoreOffer {...props} />);
    fireEvent.press(getByTestId(`in-store-offer-button`));
    expect(props.onActivatePressed).toBeCalled();
  });
});
