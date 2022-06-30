import React, { ComponentProps, memo, PropsWithChildren } from 'react';
import { LayoutChangeEvent, View } from 'react-native';

import { Tutorial, TutorialElementPosition } from '_commons/models/Tutorial';

import { useTestingHelper } from '_utils/useTestingHelper';

import { Section } from '_modules/earn/screens/EarnMain';

type ViewProps = ComponentProps<typeof View>;

export interface Props extends PropsWithChildren<ViewProps>, Tutorial {
  step: number;
  control: (key: number, value: TutorialElementPosition) => void;
  setSectionCoordinate?: (section: Section, event: LayoutChangeEvent) => void;
}

const ViewWithTutorial = (props: Props) => {
  const { step, parentId, control, isParent, isHidden, children, style, scrollToDown, setSectionCoordinate } = props;

  const { getTestIdProps } = useTestingHelper('view-tutorial');

  const handleLayout = (event: LayoutChangeEvent) => {
    if (setSectionCoordinate) setSectionCoordinate('mapCardSection', event);
    const { x, y } = event.nativeEvent.layout;
    control(step, { x, y, isParent, children, style, parentId, isHidden, scrollToDown });
  };

  return <View {...getTestIdProps('view')} {...props} onLayout={handleLayout} />;
};

export default memo(ViewWithTutorial);
