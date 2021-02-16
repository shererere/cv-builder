import React, { RefObject } from 'react';
import styled from 'styled-components';

import { Element } from '@components/element';
import { Selection } from '@components/selection';
import theme from '@styles/theme';
import { createPortal } from 'react-dom';
import { useElements } from '@modules/elements';

const Wrapper = styled.div`
  position: relative;
  width: 21cm;
  height: 29.7cm;
  background: #fff;
`;

Wrapper.defaultProps = {
  theme,
};

interface PageProps {
  selectionWrapperRef: RefObject<HTMLElement>;
};

export const Page: React.FC<PageProps> = (props) => {
  const { selectionWrapperRef } = props;
  const { elements, actions, scale } = useElements();

  return (
    <>
      <Wrapper>
        {Object.values(elements).map((item) => (
          <Element
            scale={scale}
            key={item.id}
            {...item}
          />
        ))}
      </Wrapper>
      {selectionWrapperRef.current && createPortal(
        <Selection />,
        selectionWrapperRef.current as Element
      )}
    </>
  );
};
