import React from 'react';

import NewOnMaxCard, { Props } from './NewOnMaxCard';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import WavingHandIcon from '../../../assets/shared/wavingHand.svg';

describe('PetiteMissionCard', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      title: 'Test title',
      description: 'Test description',
      Icon: 'http://test.com/icon.png',
      onClosePress: jest.fn()
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<NewOnMaxCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with action button', () => {
    const { toJSON } = renderWithGlobalContext(<NewOnMaxCard {...props} actionText="Action" onActionPress={jest.fn()} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with asset icon', () => {
    const { toJSON } = renderWithGlobalContext(<NewOnMaxCard {...props} Icon={WavingHandIcon} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render safely when icon is null', () => {
    const { toJSON } = renderWithGlobalContext(<NewOnMaxCard {...props} Icon={undefined} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
