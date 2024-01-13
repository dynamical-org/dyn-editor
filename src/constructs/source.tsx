import React from "react";
import { Construct, ConstructStateAction } from ".";
import cs from "../App.module.css";
import { ActionState, States, makeIdle, makeMovingConstruct } from "../states";
import { useMouse } from "@uidotdev/usehooks";

type Props = {
  construct: Construct;
  actionState: ActionState;
  setActionState: React.Dispatch<React.SetStateAction<ActionState>>;
  constructDispatch: React.Dispatch<ConstructStateAction>;
};

export default function SourceConstruct({
  construct,
  actionState,
  setActionState,
  constructDispatch,
}: Props) {
  // if (
  //   actionState.state === States.MovingConstruct &&
  //   actionState.constructId === construct.id
  // ) {
  //   style = {
  //     ...style,
  //     transform: `translate(${mouse.x - style.left}px,${
  //       mouse.y - style.top
  //     }px)`,
  //   };
  // }

  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (
      actionState.state === States.MovingConstruct &&
      actionState.constructId === construct.id
    ) {
      const moveWithMouse = (event: MouseEvent) => {
        if (ref.current && actionState.state === States.MovingConstruct) {
          ref.current.style["transform"] = `translate(${
            event.clientX - actionState.startX
          }px, ${event.clientY - actionState.startY}px)`;
        }
      };

      window.addEventListener("mousemove", moveWithMouse);
      return () => {
        if (ref.current) {
          ref.current.style["transform"] = "";
        }
        window.removeEventListener("mousemove", moveWithMouse);
      };
    }
  }, [actionState]);

  const { x, y, ...styleRest } = construct.style;
  return (
    <div
      ref={ref}
      className={cs.construct}
      style={{ left: x, top: y, ...styleRest }}
      onMouseDown={(e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        const offsetX = x - rect.left;
        const offsetY = y - rect.top;
        setActionState(
          makeMovingConstruct({
            constructId: construct.id,
            startX: x,
            startY: y,
            offsetX,
            offsetY,
          })
        );
        e.stopPropagation();
      }}
      onMouseUp={(e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        if (actionState.state === States.MovingConstruct) {
          constructDispatch({
            type: "move_construct",
            id: actionState.constructId,
            toX: clientX - actionState.offsetX,
            toY: clientY - actionState.offsetY,
          });
          setActionState(makeIdle());
        }
      }}
    >
      Foo
    </div>
  );
}

function getOutletCoords(construct: Construct) {
  return {
    x: construct.style.left + construct.style.width - 20,
    y: construct.style.top + construct.style.height / 2,
  };
}
function getInletCoords(construct: Construct) {
  return {
    x: construct.style.x + 20,
    y: construct.style.y + construct.style.height / 2,
  };
}

function handleConstructMouseDown(event: React.MouseEvent<SVGRectElement>) {
  event.stopPropagation();
  const { clientX, clientY } = event;
  const construct = constructState.constructs.find(
    (c) => c.id == event.currentTarget.dataset["constructId"]
  );
  if (construct) {
    setActionState(
      makeMovingConstruct({
        constructId: construct.id,
        startX: clientX,
        startY: clientY,
        offsetX: clientX - construct.style.x,
        offsetY: clientY - construct.style.y,
      })
    );
  }
}
