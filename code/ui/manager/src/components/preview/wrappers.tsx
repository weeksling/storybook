import type { FC } from 'react';
import React, { Fragment } from 'react';
import type { ApplyWrappersProps, Wrapper } from './utils/types';
import { IframeWrapper } from './utils/components';

export const ApplyWrappers: FC<ApplyWrappersProps> = ({
  wrappers,
  id,
  storyId,
  active,
  children,
}) => {
  return (
    <Fragment>
      {wrappers.reduceRight(
        (acc, wrapper, index) => wrapper.render({ index, children: acc, id, storyId, active }),
        children
      )}
    </Fragment>
  );
};

export const defaultWrappers = [
  {
    render: (p) => (
      <IframeWrapper id="storybook-preview-wrapper" hidden={!p.active}>
        {p.children}
      </IframeWrapper>
    ),
  } as Wrapper,
];
