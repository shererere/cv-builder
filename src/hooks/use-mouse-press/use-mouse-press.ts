import { useState, MouseEvent, MouseEventHandler } from 'react';
import { throttle } from 'throttle-debounce';
import { MouseKey, TPosition } from '@types';

interface UseMousePressProps {
  targetKey: MouseKey,
  onHold?: (event: MouseEvent, position: TPosition) => void,
  onRelease?: (event: MouseEvent, position: TPosition) => void,
  onMove?: (event: MouseEvent, position: TPosition, isPressed: boolean) => void
}

export const useMousePress = ({
  targetKey,
  onHold,
  onRelease,
  onMove,
}: UseMousePressProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [position, setPosition] = useState<TPosition>({ x: 0, y: 0 });

  const downHandler = (event: MouseEvent) => {
    if (event.button === targetKey) {
      setIsPressed(true);
      if (onHold) onHold(event, position);
    }
  };

  const upHandler = (event: MouseEvent) => {
    if (event.button === targetKey) {
      setIsPressed(false);
      if (onRelease) onRelease(event, position);
    }
  };

  const moveHandler = (event: MouseEvent) => {
    setPosition({ x: event.clientX, y: event.clientY });
    if (onMove) onMove(event, position, isPressed);
  };

  const throttledMoveHandler = throttle(30, moveHandler);

  const mousePressProps = {
    onMouseDown: downHandler,
    onMouseUp: upHandler,
    onMouseMove: throttledMoveHandler,
  }

  return { mousePressProps, isPressed, position };
}