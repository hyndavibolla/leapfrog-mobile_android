import React from 'react';
import { TitleType } from '_components/Title';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import SectionWrapper, { Props } from './SectionWrapper';

describe('SectionWrapper', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      title: { value: 'My Title', type: TitleType.HEADER }
    };
  });

  it('should render with title', () => {
    const { getByTestId } = renderWithGlobalContext(<SectionWrapper {...props} />);
    expect(getByTestId('section-wrapper-title')).toHaveTextContent(props.title.value);
    expect(getByTestId('section-wrapper-title')).toHaveProp('type', TitleType.HEADER);
  });

  it('should render title with default title type', () => {
    props.title.type = undefined;
    const { getByTestId } = renderWithGlobalContext(<SectionWrapper {...props} />);
    expect(getByTestId('section-wrapper-title')).toHaveTextContent(props.title.value);
    expect(getByTestId('section-wrapper-title')).toHaveProp('type', TitleType.MAIN_SECTION);
  });
});
