import { IMeasure } from '../models/general';

export const isViewableInsideContainer = (item: IMeasure, container: IMeasure, itemVisibleThreshold: number = 0.5): boolean => {
  const minY = container.y - item.height * itemVisibleThreshold;
  const maxY = container.y + container.height - item.height * itemVisibleThreshold;
  const minX = container.x - item.width * itemVisibleThreshold;
  const maxX = container.x + container.width - item.width * itemVisibleThreshold;
  return item.y >= minY && item.y <= maxY && item.x >= minX && item.x <= maxX;
};
