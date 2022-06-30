import { NativeEventEmitter, NativeModules } from 'react-native';
import { act } from 'react-test-renderer';
import { ISailthruMessage } from '../models/general';
import { wait } from '../utils/wait';
import SailthruService from './SailthruService';

const nativeEventEmitter = new NativeEventEmitter();

const mockSailthru = {
  setDeviceToken: jest.fn(),
  handleNotification: jest.fn(),
  presentMessageDetail: jest.fn(),
  registerMessageImpression: jest.fn(),
  getRecommendations: jest.fn(),
  setAttributes: jest.fn(),
  updateLocation: jest.fn(),
  logEvent: jest.fn(),
  getUnreadCount: jest.fn(),
  getDeviceID: jest.fn(),
  setProfileVars: jest.fn(),
  getProfileVars: jest.fn(),
  logPurchase: jest.fn(),
  logAbandonedCart: jest.fn(),
  setUserId: jest.fn(),
  setUserEmail: jest.fn(),
  setExtId: jest.fn(),
  getInitialNotification: jest.fn(),
  getMessages: jest.fn(),
  markMessageAsRead: jest.fn().mockResolvedValue(true)
};

let sailthruService: SailthruService;

describe('SailthruService', () => {
  beforeEach(() => {
    sailthruService = new SailthruService();
    NativeModules.SailthruModule = mockSailthru;
  });
  it('should execute setDeviceToken function', async () => {
    await sailthruService.setDeviceToken('', () => {});
    expect(mockSailthru.setDeviceToken).toBeCalled();
  });
  it('should execute handleNotification function', async () => {
    await sailthruService.handleNotification('', () => {});
    expect(mockSailthru.handleNotification).toBeCalled();
  });
  it('should execute presentMessageDetail function', async () => {
    await sailthruService.presentMessageDetail('');
    expect(mockSailthru.presentMessageDetail).toBeCalled();
  });
  it('should execute registerMessageImpression function', async () => {
    await sailthruService.registerMessageImpression('', '');
    expect(mockSailthru.registerMessageImpression).toBeCalled();
  });
  it('should execute getRecommendations function', async () => {
    await sailthruService.getRecommendations('');
    expect(mockSailthru.getRecommendations).toBeCalled();
  });
  it('should execute setAttributes function', async () => {
    await sailthruService.setAttributes('');
    expect(mockSailthru.setAttributes).toBeCalled();
  });
  it('should execute updateLocation function', async () => {
    await sailthruService.updateLocation(0, 0);
    expect(mockSailthru.updateLocation).toBeCalled();
  });
  it('should execute logEvent function', async () => {
    await sailthruService.logEvent('');
    expect(mockSailthru.logEvent).toBeCalled();
  });
  it('should execute getUnreadCount function', async () => {
    await sailthruService.getUnreadCount();
    expect(mockSailthru.getUnreadCount).toBeCalled();
  });
  it('should execute getDeviceID function', async () => {
    await sailthruService.getDeviceID();
    expect(mockSailthru.getDeviceID).toBeCalled();
  });
  it('should execute setProfileVars function', async () => {
    await sailthruService.setProfileVars('');
    expect(mockSailthru.setProfileVars).toBeCalled();
  });
  it('should execute getProfileVars function', async () => {
    await sailthruService.getProfileVars();
    expect(mockSailthru.getProfileVars).toBeCalled();
  });
  it('should execute logPurchase function', async () => {
    await sailthruService.logPurchase('');
    expect(mockSailthru.logPurchase).toBeCalled();
  });
  it('should execute logAbandonedCart function', async () => {
    await sailthruService.logAbandonedCart('');
    expect(mockSailthru.logAbandonedCart).toBeCalled();
  });
  it('should execute setUserId function', async () => {
    await sailthruService.setUserId('');
    expect(mockSailthru.setUserId).toBeCalled();
  });
  it('should execute setUserEmail function', async () => {
    await sailthruService.setUserEmail('');
    expect(mockSailthru.setUserEmail).toBeCalled();
  });
  it('should execute setExtId function', async () => {
    await sailthruService.setExtId('');
    expect(mockSailthru.setExtId).toBeCalled();
  });
  it('should execute getInitialNotification function', async () => {
    await sailthruService.getInitialNotification();
    expect(mockSailthru.getInitialNotification).toBeCalled();
  });
  it('should execute getMessages function', async () => {
    await sailthruService.getMessages();
    expect(mockSailthru.getMessages).toBeCalled();
  });
  it('should execute markMessageAsRead function', async () => {
    await sailthruService.markMessageAsRead({} as ISailthruMessage);
    expect(mockSailthru.markMessageAsRead).toBeCalled();
  });
  it('should subscribe to event', async () => {
    const cb = jest.fn();
    const removeListener = sailthruService.onNotificationTapped(cb);
    nativeEventEmitter.emit('NotificationTapped', { eventType: '' });
    await act(() => wait(0));
    expect(cb).toBeCalled();
    removeListener();
  });
});
