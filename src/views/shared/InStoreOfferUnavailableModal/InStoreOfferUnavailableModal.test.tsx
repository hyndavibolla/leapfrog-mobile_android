import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { GeneralModel } from '../../../models';
import { getMission_1 } from '../../../test-utils/entities';
import { getMockDeps } from '../../../test-utils/getMockDeps';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';

import InStoreOfferUnavailableModal, { Props, InStoreOfferUnavailableModalKey } from './InStoreOfferUnavailableModal';

describe('InStoreOfferUnavailableModal', () => {
  let deps: GeneralModel.Deps;
  let props: Props;

  beforeEach(() => {
    deps = getMockDeps();
    const { brandName, brandLogo } = getMission_1();
    props = {
      brandName,
      brandLogo,
      onActionPress: jest.fn()
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<InStoreOfferUnavailableModal {...props} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without brand logo', () => {
    props.brandLogo = null;
    const { toJSON } = renderWithGlobalContext(<InStoreOfferUnavailableModal {...props} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should have a pressable action button', () => {
    const { getByTestId } = renderWithGlobalContext(<InStoreOfferUnavailableModal {...props} />, deps);
    fireEvent.press(getByTestId(`${InStoreOfferUnavailableModalKey}-action-btn`));
    expect(props.onActionPress).toBeCalled();
  });
});
