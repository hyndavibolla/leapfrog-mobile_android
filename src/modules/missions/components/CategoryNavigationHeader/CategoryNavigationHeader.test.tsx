import React from 'react';
import { render } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { getMissionCategory_1 } from '_test_utils/entities';
import { wait } from '_utils/wait';
import CategoryNavigationHeader, { Props } from './CategoryNavigationHeader';

jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({ navigate: jest.fn() })
}));

describe('CategoryNavigationHeader', () => {
  let props: Props;
  beforeEach(() => {
    const category = getMissionCategory_1();
    props = {
      scene: { route: { name: 'test name' } },
      navigation: { goBack: jest.fn(), navigate: jest.fn() },
      backgroundSrc: category.lifestyleUrl
    } as any;
  });

  it('should render', () => {
    const { toJSON } = render(<CategoryNavigationHeader {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with a bottom shadow', () => {
    (props.scene.route as any).params = { bottomShadow: true };
    const { toJSON } = render(<CategoryNavigationHeader {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show a search bar', async () => {
    props.searchBar = <></>;
    const { queryByTestId } = render(<CategoryNavigationHeader {...props} />);
    await act(() => wait(0));
    expect(queryByTestId('category-navigation-header-search-bar')).toBeTruthy();
  });
});
