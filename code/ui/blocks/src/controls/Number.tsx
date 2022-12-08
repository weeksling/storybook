import type { FC, ChangeEvent } from 'react';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { styled } from '@storybook/theming';
import { Form } from '@storybook/components';
import { getControlId, getControlSetterButtonId } from './helpers';

import type { ControlProps, NumberValue, NumberConfig } from './types';

const Wrapper = styled.label({
  display: 'flex',
});

type NumberProps = ControlProps<NumberValue | null> & NumberConfig;

export const parse = (value: string) => {
  const result = parseFloat(value);
  return Number.isNaN(result) ? undefined : result;
};

export const format = (value: NumberValue) => (value != null ? String(value) : '');

export const NumberControl: FC<NumberProps> = ({
  name,
  value,
  onChange,
  min,
  max,
  step,
  onBlur,
  onFocus,
}) => {
  const [inputValue, setInputValue] = useState(typeof value === 'number' ? value : '');
  const [forceVisible, setForceVisible] = useState(false);
  const [parseError, setParseError] = useState<Error>(null);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);

      const result = parseFloat(event.target.value);
      if (Number.isNaN(result)) {
        setParseError(new Error(`'${event.target.value}' is not a number`));
      } else {
        onChange(result);
        setParseError(null);
      }
    },
    [onChange, setParseError]
  );

  const onForceVisible = useCallback(() => {
    setInputValue('0');
    onChange(0);
    setForceVisible(true);
  }, [setForceVisible]);

  const htmlElRef = useRef(null);
  useEffect(() => {
    if (forceVisible && htmlElRef.current) htmlElRef.current.select();
  }, [forceVisible]);

  useEffect(() => {
    const newInputValue = typeof value === 'number' ? value : '';
    if (inputValue !== newInputValue) {
      setInputValue(value);
    }
  }, [value]);

  if (!forceVisible && value === undefined) {
    return (
      <Form.Button id={getControlSetterButtonId(name)} onClick={onForceVisible}>
        Set number
      </Form.Button>
    );
  }

  return (
    <Wrapper>
      <Form.Input
        ref={htmlElRef}
        id={getControlId(name)}
        type="number"
        onChange={handleChange}
        size="flex"
        placeholder="Edit number..."
        value={inputValue}
        valid={parseError ? 'error' : null}
        autoFocus={forceVisible}
        {...{ name, min, max, step, onFocus, onBlur }}
      />
    </Wrapper>
  );
};
