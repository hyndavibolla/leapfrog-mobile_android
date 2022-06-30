import React from 'react';
import { View } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import { StackHeaderProps } from '@react-navigation/stack';

import { ROUTES } from '_constants';
import { wait } from '_utils/wait';
import NavigationHeader from './NavigationHeader';

describe('NavigationHeader', () => {
  const routeName = 'test name';
  let props: StackHeaderProps;
  beforeEach(() => {
    props = {
      scene: { route: { name: routeName } },
      navigation: { goBack: jest.fn(), navigate: jest.fn() }
    } as any;
  });

  it('should render without avatar', () => {
    const { toJSON } = render(<NavigationHeader {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with a bottom shadow', () => {
    (props.scene.route as any).params = { bottomShadow: true };
    const { toJSON } = render(<NavigationHeader {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with placeholder avatar', () => {
    (props.scene.route as any).params = { showAvatar: true };
    const { toJSON } = render(<NavigationHeader {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with avatar img', () => {
    (props.scene.route as any).params = { showAvatar: true, avatarUrl: 'avatar.url.com' };
    const { toJSON } = render(<NavigationHeader {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should navigate to profile when pressing on avatar', async () => {
    (props.scene.route as any).params = { showAvatar: true };
    const { getByTestId } = render(<NavigationHeader {...props} />);
    fireEvent.press(getByTestId('navigation-header-avatar-button'));
    await act(() => wait(0));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.PROFILE);
  });

  it('should render with a colored background', () => {
    (props.scene.route as any).params = { transparentBackground: false };
    const { toJSON } = render(<NavigationHeader {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with a transparent background', () => {
    (props.scene.route as any).params = { transparentBackground: true };
    const { toJSON } = render(<NavigationHeader {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render with the cross go-back button', () => {
    (props.scene.route as any).params = { hideGoBackArrowBtn: true, showGoBackCrossBtn: true };
    const { toJSON } = render(<NavigationHeader {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with a search bar with colored background', () => {
    (props.scene.route as any).params = { transparentBackground: false };
    const { toJSON } = render(<NavigationHeader {...props} searchBar={<View />} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a title', async () => {
    const title = 'My Title';
    (props.scene.route as any).params = { title };
    const { getByTestId } = render(<NavigationHeader {...props} />);
    expect(getByTestId('navigation-header-title')).toHaveTextContent(title.toLocaleUpperCase());
  });

  it('should render route name as title', async () => {
    (props.scene.route as any).params = { title: '' };
    const { getByTestId } = render(<NavigationHeader {...props} />);
    expect(getByTestId('navigation-header-title')).toHaveTextContent(routeName.toLocaleUpperCase());
  });

  it('should render a empty title', async () => {
    (props.scene.route as any).params = { showTitle: false };
    const { getByTestId } = render(<NavigationHeader {...props} />);
    expect(getByTestId('navigation-header-title')).toHaveTextContent('');
  });

  it('should render with header right', () => {
    const { getByTestId } = render(<NavigationHeader {...props} headerRight={<View />} />);
    expect(getByTestId('navigation-header-right')).toBeTruthy();
  });
});
