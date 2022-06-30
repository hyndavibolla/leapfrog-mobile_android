import { View } from 'react-native';

import { IMeasure } from '../models/general';

export const asyncMeasureInWindow = (view?: View) =>
  new Promise<IMeasure>(resolve => {
    if (typeof view?.measureInWindow === 'function') return view.measureInWindow((x, y, width, height) => resolve({ x, y, width, height }));
    resolve({ x: 0, y: 0, width: 0, height: 0 });
  });
