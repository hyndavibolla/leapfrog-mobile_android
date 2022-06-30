import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { GeneralModel } from '../../../models';
import { getLocalOffers_1 } from '../../../test-utils/entities';
import { getMockDeps } from '../../../test-utils/getMockDeps';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';

import InStoreOfferActivatedModal, { Props, InStoreOfferActivatedModalKey } from './InStoreOfferActivatedModal';

describe('InStoreOfferActivatedModal', () => {
  let deps: GeneralModel.Deps;
  let props: Props;
  let dateNowSpy;

  beforeEach(() => {
    deps = getMockDeps();
    const { offers } = getLocalOffers_1();
    const [
      {
        brandName,
        brandLogo,
        activeUntil,
        merchant: {
          address: { street }
        }
      }
    ] = offers;
    props = {
      brandName,
      brandLogo,
      activeUntil,
      street,
      onActionPress: jest.fn()
    };
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1629903600000);
  });

  afterAll(() => {
    dateNowSpy.mockRestore();
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<InStoreOfferActivatedModal {...props} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without brand logo and address', () => {
    props.brandLogo = null;
    props.street = null;
    const { toJSON } = renderWithGlobalContext(<InStoreOfferActivatedModal {...props} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should have a pressable action button', () => {
    const { getByTestId } = renderWithGlobalContext(<InStoreOfferActivatedModal {...props} />, deps);
    fireEvent.press(getByTestId(`${InStoreOfferActivatedModalKey}-action-btn`));
    expect(props.onActionPress).toBeCalled();
  });

  it('should show text of available days', () => {
    const { getByTestId } = renderWithGlobalContext(<InStoreOfferActivatedModal {...props} />, deps);
    expect(getByTestId(`${InStoreOfferActivatedModalKey}-text-diff-day`)).toBeTruthy();
  });

  it('should hide text of available days', () => {
    props.activeUntil = null;
    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferActivatedModal {...props} />, deps);
    expect(queryByTestId(`${InStoreOfferActivatedModalKey}-text-diff-day`)).toBeNull();
  });
});
