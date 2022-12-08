import type { FC, ReactNode } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';

const Wrapper = styled.label(({ theme }) => ({
  display: 'flex',
  borderBottom: `1px solid ${theme.appBorderColor}`,
  margin: '0 15px',
  padding: '8px 0',

  '&:last-child': {
    marginBottom: '3rem',
  },
}));

const Label = styled.span(({ theme }) => ({
  minWidth: 100,
  fontWeight: theme.typography.weight.bold,
  marginRight: 15,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  lineHeight: '16px',
}));

export interface FieldProps {
  children?: ReactNode;
  label?: ReactNode;
}

export const Field: FC<FieldProps> = ({ label, children, ...props }) => (
  <Wrapper {...props}>
    {label ? (
      <Label>
        <span>{label}</span>
      </Label>
    ) : null}
    {children}
  </Wrapper>
);

Field.defaultProps = {
  label: undefined,
};
