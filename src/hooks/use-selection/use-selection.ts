import { SelectionState } from './../../types/selection';
import { IEntity } from './../../types/elements';
import { RefObject, useState, MouseEvent, useEffect, useMemo } from "react";
import { useElements } from '@modules/elements';
import { useMousePress } from '@hooks/use-mouse-press';
import { useScale } from '@modules/scale';
import { TPosition, MouseKey } from "@types";
import { cartesianProductOfTwoPoints, contains, wrapperForElements } from '@utils';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { updatePosition } from '@modules/elements/functions/update-position';

const getNormalizedPosition = (position: TPosition, wrapper: HTMLElement, scale: number) => {
  const wrapperBounds = wrapper.getBoundingClientRect();
  return {
    x: (position.x - wrapperBounds.left) / scale,
    y: (position.y - wrapperBounds.top) / scale,
  };
};

const defaultSelectionProps = {
  x: 0,
  y: 0,
  height: 0,
  width: 0,
};

export const useSelection = (workspaceRef: RefObject<HTMLElement>) => {
  const [startPosition, setStartPosition] = useState<TPosition>({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState<TPosition>({ x: 0, y: 0 });
  const { scale } = useScale();
  const { actions, elements, selectedElements } = useElements();

  const selectionBounds = selectedElements.length
    ? wrapperForElements(selectedElements)
    : cartesianProductOfTwoPoints(startPosition, endPosition);

  const onHold = () => {
    const click = { ...endPosition, width: 1, height: 1 };
    const clickedElement = elements.find((el: IEntity) => contains(el, click));
    const clickedOnSelection = contains(selectionBounds, click);

    if (clickedElement && !clickedElement.isSelected) {
      actions.clearSelection();
      actions.select(clickedElement.id);
    }

    if (!clickedElement && !clickedOnSelection) {
      actions.clearSelection();
    }
  };

  const onMove = (_: MouseEvent, position: TPosition, isPressed: boolean) => {
    if (!workspaceRef.current) return;
    const newPosition = getNormalizedPosition(position, workspaceRef.current, scale);

    if (!isPressed) {
      setStartPosition(newPosition);
    }

    setEndPosition(newPosition);
  };

  const onRelease = () => {
    const wrappedBySelection = (el: IEntity) => contains(selectionBounds, el);
    const wrappedElements = elements.filter(wrappedBySelection);

    if (wrappedElements.length && !selectedElements.length) {
      actions.clearSelection();
      wrappedElements.forEach((el) => {
        actions.select(el.id);
      });
    }
  };

  const { mousePressProps } = useMousePress({
    targetKey: MouseKey.Left,
    onHold,
    onMove,
    onRelease,
  });

  return {
    workspaceProps: {
      ...mousePressProps,
    },
    selectionProps: {
      ...defaultSelectionProps,
      ...selectionBounds,
      active: !!selectedElements.length || !!selectionBounds.width || !!selectionBounds.height,
      scale,
    },
  }
};