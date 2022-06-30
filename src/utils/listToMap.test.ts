import { listToMap } from './listToMap';

describe('listToMap', () => {
  const getEntity_1 = () => ({ id: '1', label: 'one' });
  const getEntity_2 = () => ({ id: '2', label: 'two' });
  const getEntity_3 = () => ({ id: '3', label: 'three' });
  let initialList: any[];
  let initialMap: Record<string, any>;

  beforeEach(() => {
    initialList = [];
    initialMap = {};
  });

  it('should return same object for an empty array', () => {
    initialList = [];
    initialMap = {};

    expect(listToMap([], {})).toEqual({});
    expect(listToMap([])).toEqual({});
  });

  it('should map the array to an empty object', () => {
    initialList = [getEntity_1(), getEntity_2()];
    initialMap = {};
    expect(listToMap(initialList, initialMap)).toEqual({ [getEntity_1().id]: getEntity_1(), [getEntity_2().id]: getEntity_2() });
  });

  it('should append an item to an existent map', () => {
    initialList = [getEntity_3()];
    initialMap = { [getEntity_1().id]: getEntity_1(), [getEntity_2().id]: getEntity_2() };

    expect(listToMap(initialList, initialMap)).toEqual({
      [getEntity_1().id]: getEntity_1(),
      [getEntity_2().id]: getEntity_2(),
      [getEntity_3().id]: getEntity_3()
    });
  });

  it('should use a specific field to use as index', () => {
    initialList = [getEntity_1()];
    initialMap = {};

    expect(listToMap(initialList, initialMap, 'label')).toEqual({ [getEntity_1().label]: getEntity_1() });
  });
});
