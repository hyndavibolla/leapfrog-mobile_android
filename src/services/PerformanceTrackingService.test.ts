import { FirebasePerformanceTypes } from '@react-native-firebase/perf';
import { PerformanceTrackingService } from './PerformanceTrackingService';

describe('PerformanceTrackingService', () => {
  let firebase: FirebasePerformanceTypes.Module;
  let fetch: (url: string, init: RequestInit) => Promise<Response>;
  let metric: FirebasePerformanceTypes.HttpMetric;

  const getPerformanceTrackingService = () => new PerformanceTrackingService(firebase, fetch);

  beforeEach(() => {
    fetch = jest.fn().mockResolvedValue({ status: 200, headers: { get: jest.fn() } });
    metric = {
      putAttribute: jest.fn(),
      setHttpResponseCode: jest.fn(),
      setRequestPayloadSize: jest.fn(),
      setResponseContentType: jest.fn(),
      setResponsePayloadSize: jest.fn(),
      start: jest.fn(),
      stop: jest.fn()
    } as any;
    firebase = {
      setPerformanceCollectionEnabled: jest.fn(),
      newTrace: jest.fn(),
      newHttpMetric: jest.fn().mockReturnValue(metric),
      isPerformanceCollectionEnabled: true,
      startTrace: jest.fn()
    } as any;
  });

  describe('setPerformanceCollectionEnabled', () => {
    it('calls the native method', () => {
      const pts = getPerformanceTrackingService();
      pts.setPerformanceCollectionEnabled(true);

      expect(firebase.setPerformanceCollectionEnabled).toBeCalledWith(true);
    });
  });

  describe('initialize', () => {
    it('stores attributes to be used when creating metrics', async () => {
      const pts = getPerformanceTrackingService();
      pts.initialize({ a: 'b', c: 'd' });

      await pts.measuredFetch('https://fake.example.com', { method: 'GET' });

      expect(metric.putAttribute).toHaveBeenCalledTimes(2);
      expect(metric.putAttribute).nthCalledWith(1, 'a', 'b');
      expect(metric.putAttribute).nthCalledWith(2, 'c', 'd');
    });
  });

  describe('measuredFetch', () => {
    it('sets the request and response attributes on the metric', async () => {
      fetch = jest.fn().mockResolvedValue({
        status: 201,
        headers: {
          get: headerName => {
            switch (headerName) {
              case 'Content-Type':
                return 'application/json';
              case 'Content-Length':
                return '1000';
              default:
                return '-1';
            }
          }
        }
      });
      const pts = getPerformanceTrackingService();

      await pts.measuredFetch('https://fake.example.com', { method: 'POST', body: 'ABC123' });

      expect(metric.start).toBeCalled();
      expect(metric.setRequestPayloadSize).toBeCalledWith(6);
      expect(metric.setHttpResponseCode).toBeCalledWith(201);
      expect(metric.setResponseContentType).toBeCalledWith('application/json');
      expect(metric.setResponsePayloadSize).toBeCalledWith(1000);
      expect(metric.stop).toBeCalled();
    });

    it('stops the metric even if the request fails', async () => {
      fetch = jest.fn().mockRejectedValue({
        status: 500,
        headers: {
          get: headerName => {
            switch (headerName) {
              case 'Content-Type':
                return 'application/html';
              case 'Content-Length':
                return '1500';
              default:
                return '-1';
            }
          }
        }
      });
      const pts = getPerformanceTrackingService();

      // why toBeTruthy() instead of throws(): https://github.com/facebook/jest/issues/1700#issuecomment-377890222
      await expect(async () => {
        await pts.measuredFetch('https://fake.example.com', { method: 'POST', body: 'ABC123' });
      }).rejects.toBeTruthy();

      expect(metric.start).toBeCalled();
      expect(metric.setRequestPayloadSize).toBeCalledWith(6);
      expect(metric.setHttpResponseCode).toBeCalledWith(500);
      expect(metric.setResponseContentType).toBeCalledWith('application/html');
      expect(metric.setResponsePayloadSize).toBeCalledWith(1500);
      expect(metric.stop).toBeCalled();
    });

    it('stops the metric, even if the error is not recognized', async () => {
      fetch = jest.fn().mockRejectedValue('unknown error');
      const pts = getPerformanceTrackingService();

      // why toBeTruthy() instead of throws(): https://github.com/facebook/jest/issues/1700#issuecomment-377890222
      await expect(async () => {
        await pts.measuredFetch('https://fake.example.com', { method: 'POST', body: 'ABC123' });
      }).rejects.toBeTruthy();

      expect(metric.start).toBeCalled();
      expect(metric.setRequestPayloadSize).toBeCalledWith(6);
      expect(metric.setHttpResponseCode).not.toBeCalled();
      expect(metric.setResponseContentType).not.toBeCalled();
      expect(metric.setResponsePayloadSize).not.toBeCalled();
      expect(metric.stop).toBeCalled();
    });
  });
});
