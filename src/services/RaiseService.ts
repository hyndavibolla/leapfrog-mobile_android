/* istanbul ignore file */
/**
 * Ignoring this file for testing because we don't want to test every endpoint (configuration).
 * We will, however test methods and behaviors such as placing the token in each call, waiting for connection to be regained, etc when they are available.
 */
import moment from 'moment';

import { ENV } from '../constants';
import { HTTP_METHOD } from '../models/general';
import { RewardModel } from '../models';
import { memorize } from '../utils/memorize';
import { normalizeKeys } from '../utils/normalizeKeys';
import { Logger } from './Logger';
import { createUUID } from '../utils/create-uuid';
import { retryRequest } from '../utils/retryRequest';
import { ICrashlyticsService } from './CrashlyticsService';
import { IHttpService } from './HttpService';

export interface ISlideFetchPayload {
  pageNumber?: number;
  sizeSize?: number;
  sortBy?: 'NAME';
  sortDirection?: 'ASC' | 'DESC';
  character?: string;
  query?: string;
  autocomplete?: boolean;
  category?: string;
}

export class RaiseService {
  constructor(
    private httpService: IHttpService,
    private logger: Logger,
    private crashlyticsService: ICrashlyticsService,
    private waitForConnection: () => Promise<void>,
    private sha256: (arg: string) => Promise<string>
  ) {}

  fetchSlideBrand = async (entity: RewardModel.SlideObjectType, payload: ISlideFetchPayload = {}): Promise<RewardModel.ISlideObject[]> => {
    const { pageNumber, sizeSize, sortBy, sortDirection, character, query, autocomplete, category } = payload;
    return this.request(`v1/${entity}`, {
      'page[size]': pageNumber,
      'page[number]': sizeSize,
      sort: sortDirection,
      sort_by: sortBy,
      character,
      query,
      autocomplete,
      category
    });
  };

  fetchSlideCategoryIdList = memorize(async (): Promise<string[]> => {
    return this.request<{ id: string }[]>('v1/categories').then(list => list.map(({ id }) => id));
  });

  private request = async <T>(path: string, payload: Record<string, any> = {}): Promise<T> => {
    await this.waitForConnection();
    const parametersWithValue = Object.entries(payload).filter(([, value]) => value !== undefined);
    const queryParams = `${parametersWithValue.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')}`;
    const timestamp = moment().unix();
    const signatureContents = [timestamp, ENV.API.SLIDE.CLIENT_SECRET, path, ...parametersWithValue.map(([_, value]) => value)].map(String).sort().join(';');
    /** @todo reuse nativeHelperService.hash.buildSHA256 */
    const signature = await this.sha256(signatureContents);
    const options: any = {
      method: HTTP_METHOD.GET,
      body: undefined,
      headers: {
        'X-Client': ENV.API.SLIDE.CLIENT_ID,
        'X-Timestamp': timestamp,
        'X-Signature': `v1:${signature}`,
        BRANDS_VERSION: 'v2'
      }
    };

    const fullPath = `${ENV.API.SLIDE.URL}/${path}${queryParams ? '?' : ''}${queryParams}`;
    const attemptsLeft = ENV.API.API_RETRY_REQUEST_ATTEMPTS + 1; /** One attempt and the others are the retries */
    const requestId = createUUID();
    const startedAt = Date.now();
    const onSuccess = async (response: Response) => {
      const parsedRaw = await response.json();
      const parsedResponse = parsedRaw?.data;

      this.logger.info(`Raise response to ${options.method} ${fullPath}: HTTP ${response?.status}`);
      this.logger.debug(`Raise response to ${options.method} ${fullPath}`, {
        duration: Date.now() - startedAt,
        requestId,
        parsedResponse,
        options,
        fullPath
      });
      return parsedResponse;
    };
    const onImmediateError = async (errorResponse: any) => {
      const requestResponseTimestamp = Date.now();
      const error = await (errorResponse?.json && errorResponse.json());
      const errorBody = error?.message || error || errorResponse?.message || errorResponse;

      const apiCallContext = {
        apiUrl: fullPath,
        apiRequestBody: options?.body,
        apiSentTime: startedAt,
        apiResponseTime: requestResponseTimestamp,
        apiResponseStatusCode: errorResponse?.status,
        apiResponseContent: errorResponse
      };
      this.crashlyticsService.recordError(errorBody instanceof Error ? errorBody : new Error(errorBody), apiCallContext);

      return { errorBody, mappedStatusCode: errorResponse.status?.status };
    };
    const onCriticalError = async (errorResponse: any, errorBody: any) => {
      this.logger.error(`(Raise) API Error (${options.method} ${path})`, {
        fullPath,
        options,
        errorResponse,
        errorBody,
        signatureContents,
        queryParams,
        duration: Date.now() - startedAt
      });
    };
    const onRetry = async (attemptNumber: number) => {
      this.logger.warn(`Retrying request ${options.method} ${options.fullPath}`, { attemptNumber, duration: Date.now() - startedAt, requestId });
    };

    return retryRequest({
      path: fullPath,
      attemptsLeft,
      getOptions: async () => options,
      onSuccess,
      onImmediateError,
      onCriticalError,
      onRetry,
      http: this.httpService.fetch
    }).then(normalizeKeys);
  };
}
