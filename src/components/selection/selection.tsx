import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMousePress } from '@hooks/use-mouse-press';
import { TPosition, MouseKey, TSize } from '@types';
import { start } from 'repl';

interface Wrapper {
  position: TPosition;
  size: TSize;
}

const Wrapper = styled.div<Wrapper>`
  position: fixed;
  background: #74b9ff;
  border: 1px solid #0984e3;
  opacity: 0.5;
  top: ${props => props.position.y}px;
  left: ${props => props.position.x}px;
  width: ${props => props.size.width}px;
  height: ${props => props.size.height}px;
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

  const onHold = (event: MouseEvent) => {
    setStartPosition({ x: event.clientX, y: event.clientY });
  };

  const onRelease = (event: MouseEvent) => {
  };

  const onMove = (event: MouseEvent) => {
    setEndPosition({ x: event.clientX, y: event.clientY });
  };

  const { isPressed } = useMousePress(MouseKey.Left, onHold, onRelease, onMove);

  if (!isPressed) return null;

  const { position, size } = getBounds(startPosition, endPosition);

  return (
    <Wrapper position={position} size={size} />
  );
};
