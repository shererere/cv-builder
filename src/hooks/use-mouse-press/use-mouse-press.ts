import { useState, useEffect } from 'react';
import { throttle } from 'throttle-debounce';
import { MouseEventHandler, MouseKey, TPosition } from '@types';

interface UseMousePressProps {
  targetKey: MouseKey,
  onHold?: MouseEventHandler,
  onRelease?: MouseEventHandler,
  onMove?: MouseEventHandler
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
      if (onHold) onHold(event);
    }
  };

  const upHandler = (event: MouseEvent) => {
    if (event.button === targetKey) {
      setIsPressed(false);
      if (onRelease) onRelease(event);
    }
  };

  const moveHandler = (event: MouseEvent) => {
    setPosition({ x: event.screenX, y: event.screenY });
    if (onMove) onMove(event);
  };

  const throttledMoveHandler = throttle(1, moveHandler);

  useEffect(() => {
    document.addEventListener('mousedown', downHandler);
    document.addEventListener('mousemove', throttledMoveHandler);
    document.addEventListener('mouseup', upHandler);

    return () => {
      document.removeEventListener('mousedown', downHandler);
      document.removeEventListener('mousemove', throttledMoveHandler);
      document.removeEventListener('mouseup', upHandler);
    };
  }, []);

  return { isPressed, position };
}