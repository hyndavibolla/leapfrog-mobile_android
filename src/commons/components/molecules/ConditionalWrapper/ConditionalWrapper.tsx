import React, { memo, ReactElement, ReactNode } from 'react';

export interface Props {
  condition: boolean;
  children: ReactNode;
  wrapper: (children: ReactNode) => ReactElement;
}

const ConditionalWrapper = ({ condition, children, wrapper }: Props) => {
  return <React.Fragment>{condition ? wrapper(children) : children}</React.Fragment>;
};

export default memo(ConditionalWrapper);
