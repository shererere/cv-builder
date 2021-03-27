import React from 'react';
import styled from 'styled-components';
import { IElement } from '@types';
import { useElements } from '@modules/elements';
import { useScale } from '@modules/scale';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import { updatePosition } from '@modules/elements/functions/update-position';

interface ElementProps extends IElement {
  scale: number;
}

const StyledElement = styled.div.attrs((props: ElementProps) => ({
  style: {
    width: `${props.width}px`,
    height: `${props.height}px`,
    background: `${props.background}`,
    zIndex: `${props.layer}`,
    transform: `translate(${props.x}px, ${props.y}px)`,
  },
}))`
  position: absolute;
  top: 0;
  left: 0;
`;

export const Element: React.FC<ElementProps> = (props) => {
  const { actions } = useElements();
  const { scale } = useScale();

  const styledElementProps = {
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
    background: props.background,
  };

  const draggableCoreProps = {
    bounds: 'parent',
    onDrag: (event: DraggableEvent, data: DraggableData) => {
      actions.dispatch(updatePosition)({
        x: data.deltaX,
        y: data.deltaY,
      });
    },
    position: { x: props.x, y: props.y },
    scale,
  }

  return (
    <DraggableCore {...draggableCoreProps}>
      <StyledElement {...styledElementProps}>
      </StyledElement>
    </DraggableCore>
  );
}

export default Element;