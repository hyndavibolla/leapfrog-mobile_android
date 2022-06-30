import React from 'react';
import { render } from '@testing-library/react-native';

import ErrorBoundary from './ErrorBoundary';
import { Text } from '../Text';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';

const HandGrenade = () => {
  const a: any = null;
  a.b.c = 10;
  return <Text>This should not work</Text>;
};

describe('ErrorBoundary', () => {
  global.console.warn = global.console.error = () => null;
  it('should render children', () => {
    const { toJSON } = renderWithGlobalContext(
      <ErrorBoundary>
        <Text>Render test</Text>
      </ErrorBoundary>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render null when children fail', () => {
    const { toJSON } = renderWithGlobalContext(
      <ErrorBoundary>
        <HandGrenade />
      </ErrorBoundary>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render null when children fail without a context (storybook)', () => {
    const { toJSON } = render(
      <ErrorBoundary>
        <HandGrenade />
      </ErrorBoundary>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a placeholder when children fail', () => {
    const { toJSON } = renderWithGlobalContext(
      <ErrorBoundary fallback={() => <Text>a placeholder</Text>}>
        <HandGrenade />
      </ErrorBoundary>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
