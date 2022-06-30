import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { wait } from '../../../utils/wait';
import ClaimPointsModal, { Props } from './ClaimPointsModal';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { getActivity_1, getActivity_2, getOffer_2 } from '../../../test-utils/entities';

describe('ClaimPointsModal', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      activityList: [getActivity_1(), getActivity_2()],
      onRequestClose: jest.fn(),
      showAnimation: true
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<ClaimPointsModal {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with offers with the same logo', () => {
    props.activityList = [{ ...getActivity_1(), offers: [getOffer_2(), { ...getOffer_2(), id: 'unique' }] }];
    const { toJSON } = renderWithGlobalContext(<ClaimPointsModal {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with offers with the same logo with no program subcategory', () => {
    props.activityList = [{ ...getActivity_1(), offers: [getOffer_2(), { ...getOffer_2(), id: 'unique', programSubCategory: null }] }];
    const { toJSON } = renderWithGlobalContext(<ClaimPointsModal {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should have a pressable button to dismiss the modal', async () => {
    const { findByTestId } = renderWithGlobalContext(<ClaimPointsModal {...props} />);
    fireEvent.press(await findByTestId('claim-points-continue-btn'));
    await act(() => wait(0));
    expect(props.onRequestClose).toBeCalled();
  });
});
