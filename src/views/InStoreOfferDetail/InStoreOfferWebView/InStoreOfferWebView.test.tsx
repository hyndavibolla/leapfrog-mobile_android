import React from 'react';
import { act } from 'react-test-renderer';

import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { InStoreOfferWebView, Props } from './InStoreOfferWebView';
import { wait } from '../../../utils/wait';
import { fireEvent } from '@testing-library/react-native';

describe('InStoreOfferWebView', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      route: { params: { uri: 'offer-uri.com' } }
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<InStoreOfferWebView {...props} />);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render the web-view', async () => {
    const { getByTestId } = renderWithGlobalContext(<InStoreOfferWebView {...props} />);
    await act(() => wait(0));
    expect(getByTestId('in-store-offer-detail-webview')).toBeTruthy();
  });

  it('should show the fallback when an onHttpError is fired', async () => {
    const { queryByTestId } = renderWithGlobalContext(<InStoreOfferWebView {...props} />);
    await act(() => wait(0));
    expect(queryByTestId('in-store-offer-detail-webview')).toBeTruthy();
    fireEvent(queryByTestId('in-store-offer-detail-webview'), 'onHttpError', { nativeEvent: { code: 401 } });
    await act(() => wait(0));
    expect(queryByTestId('fallback-offers-map-container')).toBeTruthy();
  });
});
