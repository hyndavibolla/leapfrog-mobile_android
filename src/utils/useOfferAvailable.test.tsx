import { useOfferAvailable } from './useOfferAvailable';
import { Type as activityType } from '../models/activity';
import { Deps } from '../models/general';
import { getMockDeps } from '../test-utils/getMockDeps';
import { renderWrappedHook } from '../test-utils/renderWrappedHook';
import { getOffer_1 } from '../test-utils/entities';
import { OfferModel } from '../models';

describe('useOfferAvailable', () => {
  let deps: Deps;
  let offer: OfferModel.IOffer;

  beforeEach(() => {
    deps = getMockDeps();
    offer = getOffer_1();
  });

  it('should tell if an offer is available', () => {
    const date = new Date();
    offer.pointStartDate = date.setDate(date.getDate() - 1);
    const { result } = renderWrappedHook(() => useOfferAvailable(activityType.AVAILABLE, offer), deps);
    expect(result.current).toBeTruthy();
  });

  it('should tell if an offer is NOT available', () => {
    const date = new Date();
    offer.pointStartDate = date.setDate(date.getDate() + 1);
    const { result } = renderWrappedHook(() => useOfferAvailable(activityType.AVAILABLE, offer), deps);
    expect(result.current).toBeFalsy();
  });

  it('should tell if an offer is available when there is no start date', () => {
    offer.pointStartDate = undefined;
    const { result } = renderWrappedHook(() => useOfferAvailable(activityType.AVAILABLE, offer), deps);
    expect(result.current).toBeTruthy();
  });
});
