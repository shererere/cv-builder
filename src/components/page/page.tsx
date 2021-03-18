import React, { RefObject, useRef } from 'react';
import styled from 'styled-components';

import { Element } from '@components/element';
import { Selection } from '@components/selection';
import theme from '@styles/theme';
import { createPortal } from 'react-dom';
import { useElements } from '@modules/elements';
import { IElement } from '@types';

const Workspace = styled.div`
  width: 30cm;
  height: 40cm;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const WhitePage = styled.div`
  width: 21cm;
  height: 29.7cm;
  background: #fff;
`;

WhitePage.defaultProps = {
  theme,
};

interface PageProps {
};

const sortByLayer = (elA: IElement, elB: IElement) => (elB.layer - elA.layer);

export const Page: React.FC<PageProps> = (props) => {
  const { elements, actions, scale } = useElements();
  const workspaceRef = useRef(null);

  return (
    <Workspace ref={workspaceRef}>
      {Object.values(elements).sort(sortByLayer).map((item) => (
        <Element
          scale={scale}
          key={item.id}
          {...item}
        />
      ))}
      <Selection workspaceRef={workspaceRef} />
      <WhitePage />
    </Workspace>
  );
};
