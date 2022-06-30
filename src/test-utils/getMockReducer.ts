import { IGlobalState } from '../models/general';
import { combinedReducer } from '../state-mgmt/GlobalState';

export const getMockReducer = (state?: IGlobalState) => jest.fn((s, a) => state || combinedReducer(s, a));
