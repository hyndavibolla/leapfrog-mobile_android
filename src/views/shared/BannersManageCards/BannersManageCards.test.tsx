import React from 'react';
import { act } from 'react-test-renderer';

import { wait } from '../../../utils/wait';
import { BannersManageCards } from '.';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { GeneralModel } from '../../../models';
import { Deps } from '../../../models/general';

import { getInitialState } from '../../../state-mgmt/GlobalState';
import { getMockDeps } from '../../../test-utils/getMockDeps';
import { getLinkedCards_1 } from '../../../test-utils/entities';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ navigate: mockedNavigate }) }));

describe('BannersManageCards', () => {
  let state: GeneralModel.IGlobalState;
  let deps: Deps;

  beforeEach(() => {
    state = getInitialState();
    deps = getMockDeps();
  });

  it('should render banner apply for card', async () => {
    state.game.current.memberships.userHasSywCard = false;
    const { queryByTestId } = renderWithGlobalContext(<BannersManageCards />, deps, state);
    await act(async () => {
      await act(() => wait(0));
      expect(queryByTestId('banner-manage-cards-banner-apply-for-card')).toBeTruthy();
    });
  });

  it('should render not banner apply for card', async () => {
    state.game.current.memberships.userHasSywCard = true;
    const { queryByTestId } = renderWithGlobalContext(<BannersManageCards />, deps, state);
    await act(() => wait(0));
    expect(queryByTestId('banner-apply-for-card-container')).toBeFalsy();
  });

  it('should render banner manage your cards', async () => {
    state.cardLink.linkedCardsList = [getLinkedCards_1()];
    const { queryByTestId } = renderWithGlobalContext(<BannersManageCards />, deps, state, () => state);
    await act(() => wait(0));
    expect(queryByTestId('banner-manage-your-card-container')).toBeTruthy();
  });

  it('should render banner add new card ', async () => {
    const { queryByTestId } = renderWithGlobalContext(<BannersManageCards />, deps, state, () => state);
    await act(() => wait(0));
    expect(queryByTestId('banner-add-new-card-container')).toBeTruthy();
  });
});
