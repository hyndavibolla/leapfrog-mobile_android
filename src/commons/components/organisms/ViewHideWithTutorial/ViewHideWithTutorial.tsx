import React, { ComponentProps, memo, PropsWithChildren, useContext } from 'react';
import { View } from 'react-native';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useTestingHelper } from '_utils/useTestingHelper';

type ViewProps = ComponentProps<typeof View>;

const opacity = 0.25;

const ViewHideWithTutorial = (props: PropsWithChildren<ViewProps>) => {
  const { getTestIdProps } = useTestingHelper('view-hide-tutorial');
  const {
    state: {
      core: { isTutorialVisible }
    }
  } = useContext(GlobalContext);
  const { style } = props;

  return <View {...props} style={[style, isTutorialVisible && { opacity }]} {...getTestIdProps('view')} />;
};

export default memo(ViewHideWithTutorial);
