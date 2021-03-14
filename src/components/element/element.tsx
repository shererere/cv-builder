import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { IElement } from '@types';
import { useElements } from '@modules/elements';
import { updatePosition } from '@modules/elements/functions/update-position';

const StyledElement = styled.div`
  position: absolute;
  width: ${(props: IElement) => props.width}px;
  height: ${(props: IElement) => props.height}px;
  background: ${(props: IElement) => props.background};
  left: 0;
  top: 0;
  will-change: transform;
  transform: translateZ(0);
`;

interface ElementProps extends IElement {
  scale: number;
}

export const Element: React.FC<ElementProps> = (props) => {
  const { id, x, y, scale } = props;
  const { actions, elements } = useElements();

  const draggableProps = {
    bounds: 'parent',
    position: { x, y },
    scale,
    onDrag: (e: any, data: any) => {
      actions.dispatch(updatePosition)({
        x: data.deltaX,
        y: data.deltaY,
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