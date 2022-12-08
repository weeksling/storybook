import type { FC } from 'react';
import React from 'react';
import { H2 } from '@storybook/components';
import { HeaderMdx } from './mdx';

export interface HeadingProps {
  children: JSX.Element | string;
  disableAnchor?: boolean;
}

export const Heading: FC<HeadingProps> = ({ children, disableAnchor }) => {
  if (disableAnchor || typeof children !== 'string') {
    return <H2>{children}</H2>;
  }
  const tagID = children.toLowerCase().replace(/[^a-z0-9]/gi, '-');
  return (
    <HeaderMdx as="h2" id={tagID}>
      {children}
    </HeaderMdx>
  );
};
