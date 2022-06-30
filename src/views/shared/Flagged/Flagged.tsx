import React, { memo, PropsWithChildren } from 'react';

import { FeatureFlag } from '../../../models/general';
import { ENV } from '../../../constants';
import ErrorBoundary from '../ErrorBoundary';

export const shouldShowFeature = (feature: FeatureFlag) => !ENV.IGNORED_FEATURE_LIST.includes(feature);

export interface Props {
  feature: FeatureFlag;
}

export const Flagged = ({ feature, children }: PropsWithChildren<Props>) => {
  return <ErrorBoundary>{shouldShowFeature(feature) ? children : null}</ErrorBoundary>;
};

export default memo(Flagged);
