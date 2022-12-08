import type { ComponentProps } from 'react';
import React, { useState } from 'react';
import { IconButton, Icons } from '@storybook/components';
import { Consumer, type Combo } from '@storybook/manager-api';
import type { Addon } from '@storybook/manager-api';
import { styled } from '@storybook/theming';
import { FORCE_REMOUNT } from '@storybook/core-events';

interface AnimatedButtonProps {
  animating?: boolean;
}

const StyledAnimatedIconButton = styled(IconButton)<
  AnimatedButtonProps & ComponentProps<typeof IconButton>
>(({ theme, animating, disabled }) => ({
  opacity: disabled ? 0.5 : 1,
  svg: {
    animation: animating && `${theme.animation.rotate360} 1000ms ease-out`,
  },
}));

const menuMapper = ({ api, state }: Combo) => {
  const { storyId } = state;
  return {
    storyId,
    remount: () => api.emit(FORCE_REMOUNT, { storyId: state.storyId }),
  };
};

export const remountTool: Addon = {
  title: 'remount',
  id: 'remount',
  match: ({ viewMode }) => viewMode === 'story',
  render: () => (
    <Consumer filter={menuMapper}>
      {({ remount, storyId }) => {
        const [isAnimating, setIsAnimating] = useState(false);
        const animateAndReplay = () => {
          if (!storyId) return;
          setIsAnimating(true);
          remount();
        };

        return (
          <StyledAnimatedIconButton
            key="remount"
            title="Remount component"
            onClick={animateAndReplay}
            onAnimationEnd={() => setIsAnimating(false)}
            animating={isAnimating}
            disabled={!storyId}
          >
            <Icons icon="sync" />
          </StyledAnimatedIconButton>
        );
      }}
    </Consumer>
  ),
};
