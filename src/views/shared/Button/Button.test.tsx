import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import Button, { Props } from './Button';

describe('Button', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      onPress: jest.fn(),
      children: 'default content',
      testID: 'btn'
    };
  });

  it('should render with a single string child', () => {
    const { toJSON } = render(<Button {...props}>Regular button</Button>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render on compatibility mode', () => {
    const { toJSON } = render(
      <Button {...props} compatibilityMode={true}>
        Regular button
      </Button>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with a single node child', () => {
    const { toJSON } = render(
      <Button {...props}>
        <div>node child</div>
      </Button>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with many children', () => {
    const { toJSON } = render(<Button {...props}>{['string child', () => <div>node child</div>]}</Button>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with customizations', () => {
    const { toJSON } = render(
      <Button
        {...props}
        style={{ margin: 1 }}
        containerColor="red"
        innerContainerStyle={{ margin: 2 }}
        textStyle={{ margin: 3 }}
        textColor="blue"
        disabled={true}
        innerContainerDisabledStyle={{ opacity: 1 }}
      >
        Regular button
      </Button>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable', () => {
    const { getByTestId } = render(<Button {...props}>Regular button</Button>);
    fireEvent.press(getByTestId('btn'));
    expect(props.onPress).toBeCalled();
  });
});
