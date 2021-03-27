import React, { useRef, MouseEventHandler } from 'react';
import styled from 'styled-components';

import { Element } from '@components/element';
import { Selection } from '@components/selection';
import theme from '@styles/theme';
import { useElements } from '@modules/elements';
import { IElement } from '@types';
import { useScale } from '@modules/scale';
import { useSelection } from '@hooks/use-selection';

const Wrapper = styled.div`
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

const sortByLayer = (elA: IElement, elB: IElement) => (elB.layer - elA.layer);

export const Workspace: React.FC = () => {
  const { elements } = useElements();
  const { scale } = useScale();
  const workspaceRef = useRef(null);
  const { workspaceProps, selectionProps } = useSelection(workspaceRef);

  return (
    <Wrapper ref={workspaceRef}  {...workspaceProps}>
      {Object.values(elements).sort(sortByLayer).map((item) => (
        <Element
          scale={scale}
          key={item.id}
          {...item}
        />
      ))}
      <WhitePage />
      <Selection {...selectionProps} />
    </Wrapper>
  );
};
