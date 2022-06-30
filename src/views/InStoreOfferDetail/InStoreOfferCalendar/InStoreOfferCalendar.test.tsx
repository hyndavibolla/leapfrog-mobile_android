import React from 'react';
import { act } from 'react-test-renderer';

import { wait } from '_utils/wait';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getLocalOffersBenefits } from '_test_utils/entities';
import { InStoreOfferCalendar, Props } from './InStoreOfferCalendar';

jest.mock('moment', () => {
  return () => jest.requireActual('moment')('2020-01-10T00:00:00.000Z');
});

describe('InStoreOfferCalendar', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      offerBenefits: getLocalOffersBenefits()
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<InStoreOfferCalendar {...props} />);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });
});
