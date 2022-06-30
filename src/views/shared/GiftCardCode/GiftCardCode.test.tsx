import React from 'react';
import { act } from 'react-test-renderer';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { wait } from '../../../utils/wait';

import GiftCardCode, { Props, CodeKind } from './GiftCardCode';

describe('GiftCardCode', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      barcodeKind: CodeKind.CODE128,
      barcodeValue: '1234567890'
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<GiftCardCode {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render correctly with size images', async () => {
    props.imageWidth = 200;
    props.imageHeight = 200;
    const { getByTestId } = renderWithGlobalContext(<GiftCardCode {...props} />);
    await act(() => wait(0));
    expect(getByTestId('image-with-fallback-container')).toBeTruthy();
  });

  it('should render correctly the images code', async () => {
    const { getByTestId } = renderWithGlobalContext(<GiftCardCode {...props} />);
    await act(() => wait(0));
    expect(getByTestId('image-with-fallback-container')).toBeTruthy();
  });

  it('should render correctly the images code with PDF417', async () => {
    props.barcodeKind = CodeKind.PDF417;
    const { getByTestId } = renderWithGlobalContext(<GiftCardCode {...props} />);
    await act(() => wait(0));
    expect(getByTestId('image-with-fallback-container')).toBeTruthy();
  });

  it('should render correctly the images code with PDF417_COMPACT', async () => {
    props.barcodeKind = CodeKind.PDF417_COMPACT;
    const { getByTestId } = renderWithGlobalContext(<GiftCardCode {...props} />);
    await act(() => wait(0));
    expect(getByTestId('image-with-fallback-container')).toBeTruthy();
  });

  it('should render correctly the images code with QR_CODE', async () => {
    props.barcodeKind = CodeKind.QR_CODE;
    const { getByTestId } = renderWithGlobalContext(<GiftCardCode {...props} />);
    await act(() => wait(0));
    expect(getByTestId('image-with-fallback-container')).toBeTruthy();
  });

  it('should render correctly the images code with DATA_MATRIX', async () => {
    props.barcodeKind = CodeKind.DATA_MATRIX;
    const { getByTestId } = renderWithGlobalContext(<GiftCardCode {...props} />);
    await act(() => wait(0));
    expect(getByTestId('image-with-fallback-container')).toBeTruthy();
  });
});
