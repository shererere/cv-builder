import { useElements } from "@modules/elements";
import { resize } from "@modules/elements/functions/resize";
import { useScale } from "@modules/scale";
import { DraggableCore, DraggableData, DraggableEvent } from "react-draggable";
import styled from "styled-components";

const HandleDiv = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
`;

const TopLeftHandleDiv = styled(HandleDiv)`
  top: -3px;
  left: -3px;
  border-top: 3px solid black;
  border-left: solid 3px black;
`;

const TopRightHandleDiv = styled(HandleDiv)`
  top: -3px;
  right: -3px;
  border-top: 3px solid black;
  border-right: solid 3px black;
`;

const BottomRightHandleDiv = styled(HandleDiv)`
  bottom: -3px;
  right: -3px;
  border-bottom: 3px solid black;
  border-right: solid 3px black;
`;

const BottomLeftHandleDiv = styled(HandleDiv)`
  bottom: -3px;
  left: -3px;
  border-bottom: 3px solid black;
  border-left: solid 3px black;
`;

export const MoveHandle = styled(HandleDiv)`
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: solid 3px black;
`;

const Handle = (Component: React.FC) => {
  const HandleComponent = () => {
    const { scale } = useScale();
    const { actions } = useElements();
    
    const draggableCoreProps = {
      bounds: 'parent',
      onDrag: (event: DraggableEvent, data: DraggableData) => {
        actions.dispatch(resize)({
          x: data.deltaX,
          y: data.deltaY,
        }, scale);
      },
      position: {},
      scale,
    };

    return (
      <DraggableCore {...draggableCoreProps}>
        <Component />
      </DraggableCore>
    )
  };

  return HandleComponent;
};

export const TopLeftHandle = Handle(TopLeftHandleDiv);
export const TopRightHandle = Handle(TopRightHandleDiv);
export const BottomLeftHandle = Handle(BottomLeftHandleDiv);
export const BottomRightHandle = Handle(BottomRightHandleDiv);