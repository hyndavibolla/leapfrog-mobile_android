import React from 'react';
import { render } from '@testing-library/react-native';

import Spinner from './Spinner';

import { ENV } from '_constants';

describe('Spinner', () => {
  it('should render', () => {
    const { toJSON } = render(<Spinner />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not render any text with initialTimer equal to 0', () => {
    const { queryByTestId } = render(<Spinner initialTimer={0} />);
    expect(queryByTestId('spinner-text')).toBeNull();
  });

  it('should render Loading... text with the initial timer', () => {
    const { getByTestId } = render(<Spinner initialTimer={ENV.SPINNER_MESSAGE_CHANGE_MS} />);
    expect(getByTestId('spinner-text')).toHaveTextContent('Loading...');
  });

  it('should render texts with twice the initial timer', () => {
    const { getAllByTestId } = render(<Spinner initialTimer={ENV.SPINNER_MESSAGE_CHANGE_MS * 2} />);
    expect(getAllByTestId('spinner-text')[0]).toHaveTextContent('Preparing your custom');
    expect(getAllByTestId('spinner-text')[1]).toHaveTextContent('experience...');
  });

  it('should render Just a few more seconds... text with triple the initial timer', () => {
    const { getByTestId } = render(<Spinner initialTimer={ENV.SPINNER_MESSAGE_CHANGE_MS * 3} />);
    expect(getByTestId('spinner-text')).toHaveTextContent('Just a few more seconds...');
  });

  it('should render This is taking longer than usual... text with quadruple the initial timer', () => {
    const { getByTestId } = render(<Spinner initialTimer={ENV.SPINNER_MESSAGE_CHANGE_MS * 4} />);
    expect(getByTestId('spinner-text')).toHaveTextContent('This is taking longer than usual...');
  });

  it('should not render the footer', () => {
    const { queryByTestId } = render(<Spinner size={10} />);
    expect(queryByTestId('spinner-footer')).toBeNull();
  });
});
