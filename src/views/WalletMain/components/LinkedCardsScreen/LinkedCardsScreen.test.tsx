import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';

import LinkedCardsScreen, { Props } from './LinkedCardsScreen';

import { GeneralModel } from '_models';
import { Deps, FeatureFlag } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getLinkedCards_1, getLinkedCards_2 } from '_test_utils/entities';
import { wait } from '_utils/wait';
import { ENV } from '_constants';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ navigate: mockNavigate }), useIsFocused: jest.fn(() => true) }));

describe('Linked Cards Screen', () => {
  let ignoredFeatureFlags: FeatureFlag[];
  let props: Props;
  let state: GeneralModel.IGlobalState;
  let deps: Deps;

  beforeAll(() => {
    ignoredFeatureFlags = ENV.IGNORED_FEATURE_LIST;
  });

  beforeEach(() => {
    ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
    props = {
      linkedCardsList: [],
      linkedCardsListError: false
    };
    state = getInitialState();
    deps = getMockDeps();
  });

  afterAll(() => {
    ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<LinkedCardsScreen {...props} />);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render apply card banner', async () => {
    state.game.current.memberships.userHasSywCard = false;
    const { getByTestId } = renderWithGlobalContext(<LinkedCardsScreen {...props} />, deps, state);
    await act(() => wait(0));
    expect(getByTestId('banner-apply-card-container')).toBeTruthy();
  });

  it('should not render wallet card', async () => {
    state.game.current.memberships.userHasSywCard = true;
    const { queryByTestId } = renderWithGlobalContext(<LinkedCardsScreen {...props} />, deps, state);
    await act(() => wait(0));
    expect(queryByTestId('linked-cards-screen-banner-description')).toBeNull();
  });

  it('should render an unlinked SYW card', async () => {
    state.game.current.memberships.userHasSywCard = true;
    props.linkedCardsList = [getLinkedCards_1()];
    const { queryByTestId } = renderWithGlobalContext(<LinkedCardsScreen {...props} />, deps, state);
    await act(() => wait(0));
    expect(queryByTestId('linked-cards-screen-banner-description')).toBeNull();
  });

  it('should render an unlinked SYW card with the last four numbers card', async () => {
    state.game.current.memberships.userHasSywCard = true;
    props.linkedCardsList = [getLinkedCards_2()];
    const { getByTestId } = renderWithGlobalContext(<LinkedCardsScreen {...props} />, deps, state);
    await act(() => wait(0));
    expect(getByTestId('item-last-four').props.children).toEqual(`**** ${getLinkedCards_2().cardLastFour}`);
  });

  it('should render modal cardlink and close it', async () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<LinkedCardsScreen {...props} />, deps, state);
    await act(() => wait(0));
    fireEvent.press(getByTestId('linked-cards-screen-more-information'));
    expect(getByTestId('linked-cards-screen-modal-cardlink')).toBeTruthy();
    fireEvent.press(getByTestId('modal-close-btn'));
    expect(queryByTestId('linked-cards-screen-modal-cardlink')).toBeFalsy();
  });
});
