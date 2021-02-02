import React, { useState } from 'react';
import styled from 'styled-components';
import { SideBar } from '@components/side-bar';
import { Page } from '@components/page';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import theme from '@styles/theme'; 

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
  const [scale, setScale] = useState(0.75);
  const [isHoldingWheel, setIsHoldingWheel] = useState(false);

  const transformWrapperProps = {
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
      disabled: !isHoldingWheel,
    },
    onZoomChange: (data: any) => {
      setScale(data.scale);
    },
  };

  const onMouseDown = (event: any) => {
    if (event.button !== 1) return; 
    setIsHoldingWheel(true);
  };
  
  const onMouseUp = (event: any) => {
    if (event.button !== 1) return; 
    setIsHoldingWheel(false);
  };

  return (
    <Wrapper onMouseDown={ onMouseDown } onMouseUp={ onMouseUp }>
      <SideBar />
      <TransformWrapper {...transformWrapperProps }>
        <PageWrapper>
          <TransformComponent>
            <Page scale={ scale } />
          </TransformComponent>
        </PageWrapper>
      </TransformWrapper>
    </Wrapper>
  );
};