import { ENV } from '../constants';
import { HTTP_METHOD } from '../models/general';
import { wait } from './wait';

export interface IRetryRequestArgs<T = any> {
  path: string;
  attemptsLeft: number;
  getOptions: () => Promise<{ method: HTTP_METHOD; headers: HeadersInit_; body?: string }>;
  onSuccess: (response: Response) => Promise<T>;
  onImmediateError: (errorResponse: any) => Promise<{ errorBody: any; mappedStatusCode: number }>;
  onCriticalError: (errorResponse: any, errorBody: any) => Promise<any>;
  onRetry: (attemptNumber: number) => Promise<void>;
  http: (url: string, init?: RequestInit) => Promise<Response>;
}

export const retryRequest = async <T>({
  path,
  attemptsLeft,
  getOptions,
  onSuccess,
  onImmediateError,
  onCriticalError,
  onRetry,
  http
}: IRetryRequestArgs): Promise<T> => {
  try {
    const options = await getOptions();
    const response = await http(path, options);
    const parsedResponse = await onSuccess(response);
    return parsedResponse;
  } catch (errorResponse) {
    const { errorBody, mappedStatusCode } = await onImmediateError(errorResponse);
    const nextAttemptCount = attemptsLeft - 1;
    const shouldRetryBasedOnStatusCode = ENV.API.API_RETRY_REQUEST_STATUS_CODE_RANGES_REGEX.test(String(mappedStatusCode));

    if (shouldRetryBasedOnStatusCode && nextAttemptCount > 0) {
      await onRetry(Math.abs(attemptsLeft - (ENV.API.API_RETRY_REQUEST_ATTEMPTS + 1) /** compensates for the first try */) + 1 /** so log is not 0 indexed */);
      await wait(ENV.API.API_RETRY_REQUEST_ATTEMPT_DELAY_MS);
      return retryRequest({ path, attemptsLeft: nextAttemptCount, getOptions, onSuccess, onImmediateError, onCriticalError, onRetry, http });
    }

    await onCriticalError(errorResponse, { errorBody, mappedStatusCode });

    throw errorBody;
  }
};
