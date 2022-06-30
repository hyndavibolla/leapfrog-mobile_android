import React, { PropsWithChildren, ReactElement } from 'react';

import { IGlobalContext } from '../../../models/general';
import { GlobalContext } from '../../../state-mgmt/GlobalState';
import { noop } from '../../../utils/noop';

export interface Props {
  fallback?: () => ReactElement;
  error?: boolean;
}

export interface IErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.PureComponent<PropsWithChildren<Props>, IErrorBoundaryState> {
  static contextType = GlobalContext;
  private static defaultProps = {
    children: null,
    fallback: () => null
  };
  public state = { hasError: false };

  public componentDidCatch(error, info) {
    ((this.context as IGlobalContext)?.deps?.logger?.error || noop)(error, { context: 'ErrorBoundary' }, info);
    this.setState({ hasError: true });
  }

  public render() {
    if (this.state.hasError || this.props.error) return this.props.fallback();
    else return this.props.children;
  }
}
