import { sortByDate } from './sortByDate';

describe('sortByDate', () => {
  it('should sort by date', () => {
    const list = ['2020-08-05T11:32:32.615Z', '2020-08-05T11:34:32.615Z', '2019-08-05T11:32:32.615Z', '2021-08-05T11:32:32.615Z'];
    expect([...list].sort(sortByDate())).toEqual([list[2], list[0], list[1], list[3]]);
  });

  it('should sort by date with nested keys', () => {
    const list = [{ k: '2020-08-05T11:32:32.615Z' }, { k: '2020-08-05T11:34:32.615Z' }, { k: '2019-08-05T11:32:32.615Z' }, { k: '2021-08-05T11:32:32.615Z' }];
    expect([...list].sort(sortByDate('k'))).toEqual([list[2], list[0], list[1], list[3]]);
  });

  it("should sort by date with nested keys when key doesn't exist", () => {
    const list = [{ k: '2020-08-05T11:32:32.615Z' }, { k: '2020-08-05T11:34:32.615Z' }, { k: '2019-08-05T11:32:32.615Z' }, { k: '2021-08-05T11:32:32.615Z' }];
    expect([...list].sort(sortByDate('m'))).toEqual([list[0], list[1], list[2], list[3]]);
  });
});
