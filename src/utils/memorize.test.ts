import { memorize } from './memorize';
import { wait } from './wait';

describe('memorize', () => {
  let concat = jest.fn();
  beforeEach(() => {
    concat = jest.fn().mockReturnValue('ab');
  });

  it('should memorize a functions return values', () => {
    const wrappedConcat = memorize(concat);
    expect(wrappedConcat('a', 'b')).toEqual('ab');
    wrappedConcat('a', 'b');
    expect(concat).toBeCalledTimes(1);
  });

  it('should enforce a max cache value', () => {
    const wrappedConcat = memorize(concat, 2);
    wrappedConcat('1', '1');
    wrappedConcat('2', '2');
    wrappedConcat('3', '3');
    wrappedConcat('2', '2');
    expect(concat).toBeCalledTimes(3);
  });

  it('should use max duration', async () => {
    const [wrappedConcat, stopCacheDurationWatcher] = memorize(concat, 500, 200);
    wrappedConcat('1', '1');
    wrappedConcat('1', '1');
    await wait(400);
    stopCacheDurationWatcher();
    wrappedConcat('1', '1');
    expect(concat).toBeCalledTimes(2);
  });
});
