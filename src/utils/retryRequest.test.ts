import { ENV } from '../constants';
import { HTTP_METHOD } from '../models/general';
import { IRetryRequestArgs, retryRequest } from './retryRequest';

describe('retryRequest', () => {
  let args: IRetryRequestArgs;
  let fullResponse: any;
  let fullError: any;

  beforeEach(() => {
    fullResponse = { status: 200, json: () => Promise.resolve({ resultCode: 0, value: { a: 1 } }) };
    fullError = { status: 503, json: () => Promise.resolve({ resultCode: 1, value: { a: 1 } }) };
    args = {
      path: 'path',
      attemptsLeft: ENV.API.API_RETRY_REQUEST_ATTEMPTS + 1,
      getOptions: async () => ({ method: HTTP_METHOD.GET, headers: {} }),
      onSuccess: async r => r.json(),
      onImmediateError: jest.fn().mockResolvedValue({ errorBody: 'error body', mappedStatusCode: 503 }),
      onCriticalError: jest.fn(),
      onRetry: jest.fn(),
      http: jest.fn().mockResolvedValue(fullResponse)
    };
  });

  it('should NOT retry if the server responds with a status code that does NOT exist in the range of status codes that need retry', async () => {
    const response = await retryRequest(args);
    expect(args.http).toBeCalledTimes(1);
    expect(args.onRetry).not.toBeCalled();
    expect(response).toEqual({ resultCode: 0, value: { a: 1 } });
  });

  it('should retry 1 time if the server responds a status code that exists in the range of status codes that need retry and then succeeds', async () => {
    args.http = jest.fn().mockRejectedValueOnce(fullError).mockResolvedValue(fullResponse);
    const response = await retryRequest(args);
    expect(args.http).toBeCalledTimes(2);
    expect(args.onImmediateError).toBeCalledTimes(1);
    expect(args.onImmediateError).toHaveBeenCalledWith(fullError);
    expect(args.onRetry).toBeCalledTimes(1);
    expect(args.onRetry).toHaveBeenCalledWith(1);
    expect(response).toEqual({ resultCode: 0, value: { a: 1 } });
  });

  it(`should retry ${ENV.API.API_RETRY_REQUEST_ATTEMPTS} times if the server responds a status code that exists in the range of status codes that need retry`, async () => {
    args.http = jest.fn().mockRejectedValue(fullError);
    try {
      await retryRequest(args);
      expect(false).toBe(true);
    } catch (error) {
      expect(args.http).toBeCalledTimes(ENV.API.API_RETRY_REQUEST_ATTEMPTS + 1);
      expect(args.onImmediateError).toBeCalledTimes(ENV.API.API_RETRY_REQUEST_ATTEMPTS + 1);
      expect(args.onImmediateError).toHaveBeenCalledWith(fullError);
      expect(args.onRetry).toBeCalledTimes(ENV.API.API_RETRY_REQUEST_ATTEMPTS);
      expect(args.onRetry).toHaveBeenCalledWith(1);
      expect(args.onCriticalError).toBeCalledTimes(1);
      expect(args.onCriticalError).toHaveBeenCalledWith(fullError, { errorBody: 'error body', mappedStatusCode: 503 });
      expect(error).toEqual('error body');
    }
  });
});
