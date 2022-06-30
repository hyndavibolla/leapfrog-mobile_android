export const getStateSnapshotStorage = <GS>() => {
  let state: GS;
  return {
    set: (s: GS) => {
      state = s;
    },
    get: () => state
  };
};
