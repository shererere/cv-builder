import React from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { IElement } from '@types';

const StyledElement = styled.div`
  position: absolute;
  width: ${(props: IElement) => props.width}px;
  height: ${(props: IElement) => props.height}px;
  background: ${(props: IElement) => props.background};
`;

export const Element: React.FC<IElement> = (props) => {
  const { id, x, y, updatePosition, scale } = props;

  const draggableProps = {
    bounds: 'parent',
    position: { x, y },
    scale,
    onDrag: (e: any, data: any) => {
      updatePosition(id, {
        x: x + data.deltaX,
        y: y + data.deltaY,
      });
    },
  };

  return (
    <Draggable {...draggableProps} >
      <StyledElement {...props} />
    </Draggable>
  );
};

export default Element;