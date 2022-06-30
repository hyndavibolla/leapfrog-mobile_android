import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';

import Accordion, { Props } from './Accordion';
import { Text } from '../Text';

describe('Accordion', () => {
  let props: Props;
  beforeEach(() => {
    props = { title: 'Title', children: 'Accordion text' };
  });

  it('should render', () => {
    const { toJSON } = render(<Accordion {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with complex content', () => {
    const { toJSON } = render(
      <Accordion {...props}>
        <View>
          <Text>i am a complex content</Text>
        </View>
      </Accordion>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render starting collapses', () => {
    const { toJSON } = render(<Accordion {...props} startsOpen={false} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show and hide accordion content', () => {
    const { getByTestId, toJSON } = render(<Accordion {...props} />);
    fireEvent.press(getByTestId('accordion-btn')); // close accordion content
    expect(toJSON()).toMatchSnapshot();
    fireEvent.press(getByTestId('accordion-btn')); // open it
    expect(toJSON()).toMatchSnapshot();
  });
});
