import { FirebasePerformanceTypes } from '@react-native-firebase/perf';

export interface IPerformanceTrackingService {
  initialize(attributes: { [key: string]: string });
  setPerformanceCollectionEnabled(enabled: boolean): Promise<null>;
  measuredFetch(url: string, init: RequestInit): Promise<Response>;
}

export class PerformanceTrackingService implements IPerformanceTrackingService {
  constructor(private firebase: FirebasePerformanceTypes.Module, private httpFetch: (url: string, init: RequestInit) => Promise<Response>) {
    this.attributes = {};
  }

  setPerformanceCollectionEnabled(enabled: boolean): Promise<null> {
    return this.firebase.setPerformanceCollectionEnabled(enabled);
  }

  private attributes: { [key: string]: string };
  initialize(attributes: { [key: string]: string }) {
    this.attributes = attributes;
  }

  private setResponseMetrics(metric: FirebasePerformanceTypes.HttpMetric, response: Response) {
    metric.setHttpResponseCode(response.status);
    metric.setResponseContentType(response.headers.get('Content-Type'));
    metric.setResponsePayloadSize(Number(response.headers.get('Content-Length')));
  }

  async measuredFetch(url: string, init: RequestInit): Promise<Response> {
    const metric = this.firebase.newHttpMetric(url, init.method as FirebasePerformanceTypes.HttpMethod);
    try {
      Object.entries(this.attributes).forEach(entry => {
        const [key, value] = entry;
        metric.putAttribute(key, value);
      });

      if (init.body) {
        metric.setRequestPayloadSize(init.body.toString().length);
      }

      await metric.start();

      const response = await this.httpFetch(url, init);
      this.setResponseMetrics(metric, response as Response);
      return response;
    } catch (e) {
      if (e.status && e.headers.get) {
        this.setResponseMetrics(metric, e as Response);
      }

      throw e;
    } finally {
      await metric.stop();
    }
  }
}
