import { TrackingStatus } from 'react-native-tracking-transparency';

import { shouldShowFeature } from '_components/Flagged';
import { FeatureFlag, ICCPASetting } from '_models/general';
import RZeroService from '_services/RZeroService';
import ForterSDKService from '_services/ForterSDKService';
import TealiumSDKService from '_services/TealiumSDKService';
import AppsFlyerService from '_services/AppsFlyerService';

import { Logger } from './Logger';
import SailthruService from './SailthruService';

export class EventTrackerService {
  private allowedStatus = ['authorized', 'unavailable'];

  constructor(
    private tealiumSDKService: TealiumSDKService,
    private appsFlyerService: AppsFlyerService,
    private sailthruService: SailthruService,
    private forterSDKService: ForterSDKService,
    private logger: Logger,
    private getTrackingStatus: () => Promise<TrackingStatus>,
    private requestTrackingPermission: () => Promise<TrackingStatus>,
    private cCPASetting: () => Promise<ICCPASetting>,
    private rZeroService: RZeroService
  ) {}

  isTrackingEnabled = async () => {
    const setting = await this.cCPASetting();
    const trackingStatus = await this.getTrackingStatus();
    if (setting?.allow === true && trackingStatus === 'not-determined') {
      const trackStatusFromPermission = await this.requestTrackingPermission();
      return this.allowedStatus.includes(trackStatusFromPermission);
    }
    return this.allowedStatus.includes(trackingStatus);
  };

  trackDataUser = async (userEmail: string, sywUserId: string, sywMemberId: string): Promise<void> => {
    if (shouldShowFeature(FeatureFlag.SAILTHRU_TRACKING)) {
      try {
        await this.sailthruService.setUserId(sywUserId);
        await this.sailthruService.setUserEmail(userEmail);
        await this.sailthruService.setExtId(sywMemberId);
      } catch (e) {
        this.logger.error(e, { context: 'Tracking user data in SailThru', userEmail, sywUserId, sywMemberId });
      }
    }

    if (!(await this.isTrackingEnabled())) return;
    this.appsFlyerService.setCustomerUserId(sywMemberId, result => {
      this.logger.info('Tracking user ID in AppsFlyer', { result });
    });
  };

  public get rZero() {
    return this.rZeroService;
  }

  public get forterSDK() {
    return this.forterSDKService;
  }

  public get tealiumSDK() {
    return this.tealiumSDKService;
  }

  public get appsFlyerSDK() {
    return this.appsFlyerService;
  }
}
