import React, { ComponentProps, memo, useState, useEffect, useCallback } from 'react';
import styled from '@emotion/native';

import { COLOR, CONTAINER_STYLE } from '../../../constants';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { patternValidationUtil } from '../../../utils/patternValidationUtil';

export interface Props {
  isInvalid?: boolean;
  pattern?: string;
  typePattern?: string;
  errorText?: string;
  isModeUpdate?: boolean;
  onChangeValidate?: (value: string, isValid: boolean) => void;
}

const TextInput = styled.TextInput<Props>`
  border-radius: 4px;
  border: 1px ${({ isInvalid }) => (isInvalid ? COLOR.RED : COLOR.TRANSPARENT)} solid;
  width: 100%;
  padding: 15px;
  background-color: ${COLOR.WHITE};
`;

export const Input = (props: ComponentProps<typeof TextInput>) => {
  const { getTestIdProps } = useTestingHelper('text-input');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isModeUpdateOk, setIsModeUpdateOk] = useState(false);

  const onChange = useCallback(
    (value: string) => {
      const { pattern, typePattern } = props;
      const isFieldValid = patternValidationUtil.isValid(value, pattern, typePattern);
      setIsInvalid(!isFieldValid);
      if (props.onChangeValidate) props.onChangeValidate(value, isFieldValid);
      if (props.onChangeText) props.onChangeText(value);
    },
    [props]
  );

  useEffect(() => {
    if (props.isModeUpdate && !isModeUpdateOk) {
      setIsModeUpdateOk(true);
      onChange(props.value);
    }
  }, [onChange, props.isModeUpdate, props.value, isModeUpdateOk]);

  return (
    <>
      <View style={[CONTAINER_STYLE.shadow, styles.container, isInvalid && styles.error]}>
        <TextInput {...props} onChangeText={onChange} />
      </View>
      {props.errorText && isInvalid && (
        <Text {...getTestIdProps('text')} style={styles.errorText}>
          {props.errorText}
        </Text>
      )}
    </>
  );
};

export default memo(Input);
