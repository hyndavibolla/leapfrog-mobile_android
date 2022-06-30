import React from 'react';
import { Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { Icon } from '_commons/components/atoms/Icon';
import { ICON } from '_constants/icons';
import { ActivityModel, OfferModel } from '_models';
import { getMission_1 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { wait } from '_utils/wait';
import BrandLogo, { Props } from './BrandLogo';

describe('BrandLogo', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      category: getMission_1()?.pointsAwarded?.conditions[0]?.category,
      image: getMission_1().brandLogo
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<BrandLogo {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with streak indicator', () => {
    const { toJSON } = renderWithGlobalContext(<BrandLogo {...props} streakIndicator={true} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without a logo', () => {
    const { toJSON } = renderWithGlobalContext(<BrandLogo {...props} image={undefined} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with a custom fallback', () => {
    const { toJSON } = renderWithGlobalContext(<BrandLogo {...props} image={undefined} Fallback={() => <Text>custom fallback</Text>} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render loading', async () => {
    const { toJSON, getByTestId } = renderWithGlobalContext(<BrandLogo {...props} Fallback={() => <Text>custom fallback</Text>} />);
    await act(() => wait(0));
    fireEvent(getByTestId('brand-logo-image'), 'onLoadStart');
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
    fireEvent(getByTestId('brand-logo-image'), 'onLoadEnd');
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with an error', async () => {
    const { toJSON, getByTestId } = renderWithGlobalContext(<BrandLogo {...props} Fallback={() => <Text>custom fallback</Text>} />);
    fireEvent(getByTestId('brand-logo-image'), 'onError', new Error());
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a pointsExpiry icon', () => {
    const { toJSON } = renderWithGlobalContext(<BrandLogo category={OfferModel.PointsType.POINTS_EXPIRY} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a streak icon', () => {
    const { toJSON } = renderWithGlobalContext(<BrandLogo category={OfferModel.ProgramType.STREAK} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it.each(Object.values(OfferModel.ProgramSubCategory))('should render the %o programSubCategory icon', async programSubCategory => {
    const { toJSON } = renderWithGlobalContext(<BrandLogo category={programSubCategory} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it.each(Object.values(ActivityModel.Type))('should render the %o activityType icon', async activityType => {
    const { toJSON } = renderWithGlobalContext(<BrandLogo activityType={activityType} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call onLoad callback', async () => {
    const onLoad = jest.fn();
    props.onLoadImageCallback = onLoad;
    const { getByTestId } = renderWithGlobalContext(<BrandLogo {...props} Fallback={() => <Text>custom fallback</Text>} />);
    await act(() => wait(0));
    fireEvent(getByTestId('brand-logo-image'), 'onLoad');
    await act(() => wait(0));
    expect(onLoad).toBeCalled();
  });

  it('should render with icon', () => {
    props.image = undefined;
    props.icon = <Icon name={ICON.ARROW_DIAGONAL} />;
    const { getByTestId } = renderWithGlobalContext(<BrandLogo {...props} Fallback={() => <Text>custom fallback</Text>} />);
    expect(getByTestId('icon-text')).toBeTruthy();
  });
});
