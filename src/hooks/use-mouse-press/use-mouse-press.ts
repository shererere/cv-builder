import { useState, useEffect } from 'react';
import { MouseKey } from '@types';

export const useMousePress = (targetKey: MouseKey) => {
  const [isPressed, setIsPressed] = useState(false);

  const downHandler = (event: MouseEvent) => {
    if (event.button === targetKey) {
      setIsPressed(true);
    }
  };

  const upHandler = (event: MouseEvent) => {
    if (event.button === targetKey) {
      setIsPressed(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', downHandler);
    document.addEventListener('mouseup', upHandler);

    return () => {
      document.removeEventListener('mousedown', downHandler);
      document.removeEventListener('mouseup', upHandler);
    };
  }, []);

  return { isPressed };
}