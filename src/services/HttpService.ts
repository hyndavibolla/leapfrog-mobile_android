import { FeatureFlag } from '../models/general';
import { fetchDevOverride } from '../utils/fetchDevOverride';
import { shouldShowFeature } from '_components/Flagged';

export interface IHttpService {
  fetch: (url: string, init: RequestInit) => Promise<Response>;
}

export class HttpService {
  constructor(private storageGet: <T>(key: string) => Promise<T>, private fetchFromNetwork: (url: string, init: RequestInit) => Promise<Response>) {}

  fetch = async (url: string, init: RequestInit): Promise<Response> => {
    const apiOverrideEnabled = shouldShowFeature(FeatureFlag.API_OVERRIDE);
    const request = apiOverrideEnabled ? fetchDevOverride(url, init, this.storageGet, this.fetchFromNetwork) : this.fetchFromNetwork(url, init);
    const response = await request;

    if (response.status >= 200 && response.status < 400) return response;
    throw response;
  };
}
