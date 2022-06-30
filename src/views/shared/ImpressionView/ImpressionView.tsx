/* istanbul ignore file */
import React, { PureComponent } from 'react';
import { requireNativeComponent, UIManager, findNodeHandle } from 'react-native';

import { ButtonCreativeType } from '../../../models/general';
import { GlobalContext } from '../../../state-mgmt/GlobalState';
const RNTImpressionView = requireNativeComponent('RNTImpressionView');

export default class ImpressionView extends PureComponent {
  static contextType = GlobalContext;
  configureWithDetails = (url: string, offerID: string, rate: number, rateIsFixed: boolean, creativeType: ButtonCreativeType) => {
    this.context.deps.logger.info('ImpressionView: configureWithDetails', { offerID });
    this.context.deps.logger.debug('ImpressionView: configureWithDetails', { url, offerID, rate, rateIsFixed, creativeType });

    UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.getViewManagerConfig('RNTImpressionView').Commands.configureWithDetails, [
      url,
      offerID,
      Number(Number(rate).toFixed(2)),
      rateIsFixed,
      creativeType
    ]);
  };

  render() {
    return <RNTImpressionView {...this.props} />;
  }
}
