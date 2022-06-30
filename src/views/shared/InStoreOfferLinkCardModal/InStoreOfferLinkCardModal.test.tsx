import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { GeneralModel } from '../../../models';
import { getMission_1 } from '../../../test-utils/entities';
import { getMockDeps } from '../../../test-utils/getMockDeps';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';

import InStoreOfferLinkCardModal, { Props, InStoreOfferLinkCardModalKey } from './InStoreOfferLinkCardModal';

describe('InStoreOfferLinkCardModal', () => {
  let deps: GeneralModel.Deps;
  let props: Props;

  beforeEach(() => {
    deps = getMockDeps();
    const { brandName, brandLogo } = getMission_1();
    props = {
      brandName,
      brandLogo,
      onLinkCardPress: jest.fn(),
      onCancel: jest.fn()
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<InStoreOfferLinkCardModal {...props} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without brand logo', () => {
    props.brandLogo = null;
    const { toJSON } = renderWithGlobalContext(<InStoreOfferLinkCardModal {...props} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should have a pressable link card button', () => {
    const { getByTestId } = renderWithGlobalContext(<InStoreOfferLinkCardModal {...props} />, deps);
    fireEvent.press(getByTestId(`${InStoreOfferLinkCardModalKey}-link-card-btn`));
    expect(props.onLinkCardPress).toBeCalled();
  });

  it('should have a pressable cancel button', () => {
    const { getByTestId } = renderWithGlobalContext(<InStoreOfferLinkCardModal {...props} />, deps);
    fireEvent.press(getByTestId(`${InStoreOfferLinkCardModalKey}-cancel-btn`));
    expect(props.onCancel).toBeCalled();
  });
});
