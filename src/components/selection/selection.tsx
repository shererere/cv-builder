import React, { useState } from 'react';
import styled from 'styled-components';
import { useMousePress } from '@hooks/use-mouse-press';
import { TPosition, MouseKey, TSize } from '@types';

interface Wrapper {
  position: TPosition;
  size: TSize;
  active: boolean;
}

const Wrapper = styled.div.attrs<Wrapper>((props) => ({
  style: {
    top: `${props.position.y}px`,
    left: `${props.position.x}px`,
    width: `${props.size.width}px`,
    height: `${props.size.height}px`,
  },
})) <Wrapper>`
  position: fixed;
  background: ${props => props.active ? '#74b9ff' : 'transparent'};
  border: ${props => props.active ? '1px solid #0984e3' : '1px dashed #0984e3'};
  opacity: 0.5;
`;

interface ISelection {
}

const getBounds = (startPosition: TPosition, endPosition: TPosition) => {
  const x = Math.min(startPosition.x, endPosition.x);
  const y = Math.min(startPosition.y, endPosition.y);
  const maxX = Math.max(startPosition.x, endPosition.x);
  const maxY = Math.max(startPosition.y, endPosition.y);
  const width = Math.abs(maxX - x);
  const height = Math.abs(maxY - y);
  return {
    position: { x, y },
    size: { width, height },
  };
};

export const Selection: React.FC<ISelection> = () => {
  const [startPosition, setStartPosition] = useState<TPosition>({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState<TPosition>({ x: 0, y: 0 });
  const [selecting, setSelecting] = useState(false);

  const onHold = (event: MouseEvent) => {
    setSelecting(true);
    setStartPosition({ x: event.clientX, y: event.clientY });
  };

  const onRelease = (event: MouseEvent) => {
    setSelecting(false);
  };

  const onMove = (event: MouseEvent) => {
    setEndPosition({ x: event.clientX, y: event.clientY });
  };

  const { isPressed } = useMousePress(MouseKey.Left, onHold, onRelease, onMove);

  if (!isPressed) return null;

  const { position, size } = getBounds(startPosition, endPosition);

  return (
    <Wrapper position={position} size={size} active={selecting} />
  );
};
