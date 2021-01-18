import React, { useRef } from 'react';
import styled from 'styled-components';
import SideBar from '../SideBar/SideBar';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import theme from '../../styles/theme'; 

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

const Page = styled.div`
  width: 21cm;
  height: 29.7cm;
  background: #fff;
`;

PageWrapper.defaultProps = {
  theme,
};

const MainPage = () => {
  const pageRef = useRef(null);
  const pageWrapperRef = useRef(null);

  const transformWrapperProps = {
    defaultPositionX: 100,
    defaultPositionY: 25,
    defaultScale: 0.75,
    options: {
      minScale: 0.2,
      centerContent: false,
      limitToBounds: false,
    },
    scalePadding: {
      disabled: true,
    },
  };

  return (
    <Wrapper>
      <SideBar />
      <TransformWrapper {...transformWrapperProps } >
        <PageWrapper ref={ pageWrapperRef } >
          <TransformComponent>
            <Page ref={ pageRef } />
          </TransformComponent>
        </PageWrapper>
      </TransformWrapper>
    </Wrapper>
  );
};

export default MainPage;