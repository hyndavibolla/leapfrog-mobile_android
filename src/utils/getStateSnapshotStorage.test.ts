import { getStateSnapshotStorage } from './getStateSnapshotStorage';

describe('getStateSnapshotStorage', () => {
  it("should have access to the state's reference", () => {
    const stateSnapshot = getStateSnapshotStorage();
    const state = { a: 1 };
    expect(stateSnapshot.get()).toBe(undefined);
    stateSnapshot.set(state);
    expect(stateSnapshot.get()).toBe(state);
  });
});
