import React from 'react';
import styled from 'styled-components';
import { IEntity, SelectionState } from '@types';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import { useScale } from '@modules/scale';
import { useElements } from '@modules/elements';
import { updatePosition } from '@modules/elements/functions/update-position';
import { BottomLeftHandle, BottomRightHandle, TopLeftHandle, TopRightHandle } from './handle';

interface SelectionProps extends IEntity {
  state: SelectionState;
  active: boolean;
}

interface WrapperProps extends IEntity {
  state: SelectionState;
}

const Wrapper = styled.div.attrs((props: WrapperProps) => ({
  style: {
    transform: `translate(${props.x}px, ${props.y}px)`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    border: `1px solid blue`,
  },
})) <WrapperProps>`
  position: absolute;
  opacity: 0.5;
  left: 0;
  top: 0;
  background: #74b9ff;
  border: 1px solid #0984e3;
  will-change: transform;
  z-index: 9999;
`;


const InnerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const Selection: React.FC<SelectionProps> = ({
  active,
  height,
  width,
  state,
  x,
  y,
}) => {
  const { actions } = useElements();
  const { scale } = useScale();

  const wrapperProps = {
    x,
    y,
    width,
    height,
    scale,
    state,
  };

  const draggableCoreProps = {
    bounds: 'parent',
    onDrag: (event: DraggableEvent, data: DraggableData) => {
      actions.dispatch(updatePosition)({
        x: data.deltaX,
        y: data.deltaY,
      });
    },
    position: { x, y },
    scale,
  };

  if (!active) {
    return null;
  }

  switch (state) {
    case SelectionState.Move:
      return (
        <DraggableCore {...draggableCoreProps}>
          <Wrapper {...wrapperProps}>
          </Wrapper>
        </DraggableCore>
      );

    case SelectionState.Resize:
      return (
        <Wrapper {...wrapperProps}>
          <InnerWrapper>
            <TopLeftHandle />
            <TopRightHandle />
            <BottomLeftHandle />
            <BottomRightHandle />
          </InnerWrapper>
        </Wrapper>
      );

    default:
      return (
        <Wrapper {...wrapperProps} />
      );
  }
}