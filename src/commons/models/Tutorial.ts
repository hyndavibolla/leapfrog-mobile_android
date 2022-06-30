import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface Tutorial {
  isParent?: boolean;
  isHidden?: boolean;
  parentId?: number;
  scrollToDown?: number;
}

export interface TutorialElementPosition extends Tutorial {
  x: number;
  y: number;
  children: ReactNode;
  style: StyleProp<ViewStyle>;
}
