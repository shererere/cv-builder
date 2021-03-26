import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { SideBar } from '@components/side-bar';
import { Page } from '@components/page';
import { MouseKey } from '@types';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import theme from '@styles/theme';
import { useMousePress } from '@hooks/use-mouse-press';
import { useElements } from '@modules/elements';
import { useScale } from '@modules/scale';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .react-transform-component {
    width: 100%;
  }
`;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  background: ${theme.background};
`;

PageWrapper.defaultProps = {
  theme,
};

export const MainPage = () => {
  const { scale, setScale } = useScale();
  const { isPressed } = useMousePress({ targetKey: MouseKey.Middle });

  const transformWrapperProps = useMemo(() => ({
    defaultPositionX: 100,
    defaultPositionY: 25,
    defaultScale: scale,
    options: {
      minScale: 0.2,
      centerContent: false,
      limitToBounds: false,
    },
    scalePadding: {
      disabled: true,
    },
    pan: {
      disabled: !isPressed,
    },
    doubleClick: {
      disabled: true,
    },
    onZoomChange: ({ scale: newScale }: any) => {
      if (newScale !== scale) {
        setScale(newScale);
      }
    },
  }), [scale, isPressed]);

  return (
    <Wrapper>
      <SideBar />
      <TransformWrapper {...transformWrapperProps}>
        <PageWrapper>
          <TransformComponent>
            <Page />
          </TransformComponent>
        </PageWrapper>
      </TransformWrapper>
    </Wrapper>
  );
};