import React from 'react';

import CardBenefits, { Props } from './CardBenefits';
import { GameModel } from '../../../models';
import { Deps } from '../../../models/general';
import { getMockDeps } from '../../../test-utils/getMockDeps';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';

describe('CardBenefits', () => {
  Date.now = () => 1980;
  let props: Props;
  let deps: Deps;

  beforeEach(() => {
    props = {
      minimumPointsThreshold: 30000,
      maximumPointsThreshold: 34999,
      levelNumber: 6,
      userPoints: 0,
      reevaluationDate: new Date(2020, 7, 30),
      subtype: GameModel.LevelState.SAFE
    };
    deps = getMockDeps();
  });

  it.each(Object.values(GameModel.LevelState))('should render the %o subtype', async subtype => {
    const { toJSON } = renderWithGlobalContext(<CardBenefits {...props} subtype={subtype as GameModel.LevelState} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with defaults', () => {
    const { toJSON } = renderWithGlobalContext(
      <CardBenefits minimumPointsThreshold={props.minimumPointsThreshold} maximumPointsThreshold={props.maximumPointsThreshold} />,
      deps
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with outdated data', () => {
    props.reevaluationDate = 1000;
    const { toJSON } = renderWithGlobalContext(<CardBenefits {...props} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with non zero userPoints', () => {
    const { toJSON } = renderWithGlobalContext(
      <CardBenefits minimumPointsThreshold={props.minimumPointsThreshold} maximumPointsThreshold={props.maximumPointsThreshold} userPoints={5000} />,
      deps
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with null maximumPointsThreshold', () => {
    const { toJSON } = renderWithGlobalContext(<CardBenefits minimumPointsThreshold={props.minimumPointsThreshold} maximumPointsThreshold={null} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with full progress when points exceed maximumPointsThreshold', () => {
    props.userPoints = 40000;
    const { toJSON } = renderWithGlobalContext(<CardBenefits {...props} maximumPointsThreshold={null} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should NOT render when there is no data set available', () => {
    const { toJSON } = renderWithGlobalContext(<CardBenefits {...props} subtype={null} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });
});
