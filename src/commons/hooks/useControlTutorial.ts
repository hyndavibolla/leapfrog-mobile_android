import { useState } from 'react';
import { TutorialElementPosition } from '_commons/models/Tutorial';

const useControlTutorial = () => {
  const [tutorialItems, setTutorialItems] = useState<Map<number, TutorialElementPosition>>(new Map());
  const [parentTutorialItems, setParentTutorialItems] = useState<Map<number, TutorialElementPosition>>(new Map());
  const [topHeight, setTopHeight] = useState<number>(0);

  const updateTutorialItems = (key: number, value: TutorialElementPosition) => {
    if (value.isParent) {
      setParentTutorialItems(prevState => new Map(prevState.set(key, value)));
    } else {
      setTutorialItems(prevState => new Map(prevState.set(key, value)));
    }
  };
  return { topHeight, setTopHeight, parentTutorialItems, tutorialItems, updateTutorialItems };
};

export { useControlTutorial };
