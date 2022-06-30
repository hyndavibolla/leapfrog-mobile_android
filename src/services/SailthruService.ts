import { NativeEventEmitter, NativeModules } from 'react-native';
import { ISailthruMessage } from '../models/general';

type PushNotification = {
  eventType: string;
};

class SailthruService {
  setDeviceToken(fcmToken: string, cb: (error: any) => void) {
    return NativeModules.SailthruModule.setDeviceToken(fcmToken, cb);
  }

  handleNotification(messageString: string, cb: (error: any, message: any) => void): void {
    return NativeModules.SailthruModule.handleNotification(messageString, cb);
  }

  presentMessageDetail(message: any): void {
    return NativeModules.SailthruModule.presentMessageDetail(message);
  }

  registerMessageImpression(messageImpressionType: string | number, message: any): void {
    return NativeModules.SailthruModule.registerMessageImpression(messageImpressionType, message);
  }

  async getRecommendations(sectionId: string): Promise<any[]> {
    return await NativeModules.SailthruModule.getRecommendations(sectionId);
  }

  async setAttributes(attributeMapInstance: any): Promise<void> {
    return await NativeModules.SailthruModule.setAttributes(attributeMapInstance);
  }

  updateLocation(lat: number, lon: number): void {
    return NativeModules.SailthruModule.updateLocation(lat, lon);
  }

  logEvent(event: string): void {
    return NativeModules.SailthruModule.logEvent(event);
  }

  async getUnreadCount(): Promise<number> {
    return await NativeModules.SailthruModule.getUnreadCount();
  }

  async getDeviceID(): Promise<string> {
    return await NativeModules.SailthruModule.getDeviceID();
  }

  async setProfileVars(vars: any): Promise<void> {
    return await NativeModules.SailthruModule.setProfileVars(vars);
  }

  async getProfileVars(): Promise<any> {
    return await NativeModules.SailthruModule.getProfileVars();
  }

  async logPurchase(purchase: any): Promise<void> {
    return await NativeModules.SailthruModule.logPurchase(purchase);
  }

  async logAbandonedCart(purchase: any): Promise<void> {
    return await NativeModules.SailthruModule.logAbandonedCart(purchase);
  }

  async setUserId(userId: string): Promise<void> {
    return await NativeModules.SailthruModule.setUserId(userId);
  }

  async setUserEmail(email: string): Promise<void> {
    return await NativeModules.SailthruModule.setUserEmail(email);
  }

  async setExtId(extId: string): Promise<void> {
    return await NativeModules.SailthruModule.setExtId(extId);
  }

  onNotificationTapped(callbackFunction: (pushNotification: PushNotification) => void) {
    const eventEmitter = new NativeEventEmitter(NativeModules.SailthruModule);
    const eventListener = eventEmitter.addListener('NotificationTapped', async pushNotification => callbackFunction(pushNotification));
    return () => {
      eventListener.remove();
    };
  }

  async getInitialNotification(): Promise<PushNotification> {
    return await NativeModules.SailthruModule.getInitialNotification();
  }

  async getMessages(): Promise<ISailthruMessage[]> {
    return await NativeModules.SailthruModule.getMessages();
  }

  async markMessageAsRead(message: ISailthruMessage): Promise<void> {
    return await NativeModules.SailthruModule.markMessageAsRead(message);
  }
}

export default SailthruService;
