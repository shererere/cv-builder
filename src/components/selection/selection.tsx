import React from 'react';
import styled from 'styled-components';
import { IEntity } from '@types';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import { useScale } from '@modules/scale';
import { useElements } from '@modules/elements';
import { updatePosition } from '@modules/elements/functions/update-position';

interface SelectionProps extends IEntity {
}

interface WrapperProps extends IEntity {
}

const Wrapper = styled.div.attrs((props: WrapperProps) => ({
  style: {
    transform: `translate(${props.x}px, ${props.y}px)`,
    width: `${props.width}px`,
    height: `${props.height}px`,
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

const Handle = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
`;

const TopLeftHandle = styled(Handle)`
  top: -3px;
  left: -3px;
  border-top: 3px solid black;
  border-left: solid 3px black;
`;

const TopRightHandle = styled(Handle)`
  top: -3px;
  right: -3px;
  border-top: 3px solid black;
  border-right: solid 3px black;
`;

const BottomRightHandle = styled(Handle)`
  bottom: -3px;
  right: -3px;
  border-bottom: 3px solid black;
  border-right: solid 3px black;
`;

const BottomLeftHandle = styled(Handle)`
  bottom: -3px;
  left: -3px;
  border-bottom: 3px solid black;
  border-left: solid 3px black;
`;

const MoveHandle = styled(Handle)`
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: solid 3px black;
`;

export const Selection: React.FC<SelectionProps> = (props) => {
  const { actions } = useElements();
  const { scale } = useScale();

  const wrapperProps = {
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
    scale,
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
      <Wrapper {...wrapperProps}>
      </Wrapper>
    </DraggableCore>
  );
}