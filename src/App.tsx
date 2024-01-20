import cs from "./App.module.css";
import React from "react";
import {
  ActionState,
  States,
  makeConnectingConstructs,
  makeIdle,
  makeMovingConstruct,
  makeConstructMenuOpened,
  makeConstructMenuPrimed,
} from "./states";
import {
  Construct,
  ConstructByType,
  ConstructType,
  constructReducer,
} from "./constructs";
import SourceConstruct from "./constructs/source";

function App() {
  const [actionState, setActionState] = React.useState<ActionState>(makeIdle());
  const [constructState, constructDispatch] = React.useReducer(
    constructReducer,
    {
      constructs: [],
      connections: [],
    }
  );

  // React.useEffect(() => {
  //   console.log('actionState', actionState);
  // }, [actionState]);
  // React.useEffect(() => {
  //   console.log('constructs', constructState.constructs);
  // }, [constructState.constructs]);

  const activeConnectionRef = React.useRef<SVGLineElement>(null);
  React.useEffect(() => {
    const line = activeConnectionRef.current;
    if (actionState.state === States.ConnectingConstructs) {
      const moveWithMouse = (event: MouseEvent) => {
        if (line && actionState.state === States.ConnectingConstructs) {
          line.setAttribute("x2", `${event.clientX}`);
          line.setAttribute("y2", `${event.clientY}`);
        }
      };

      window.addEventListener("mousemove", moveWithMouse);
      return () => {
        window.removeEventListener("mousemove", moveWithMouse);
      };
    }
  }, [actionState]);

  return (
    <>
      {actionState?.state === States.ConstructMenuOpened && (
        <div
          className={cs.createMenu}
          style={{ top: actionState.y, left: actionState.x }}
        >
          <span className={cs.createMenuTitle}>CREATE</span>
          <ul>
            {Object.keys(ConstructType).map((cT) => (
              <li
                key={cT}
                onClick={(e) => {
                  handleCreateClick(e, cT as ConstructType);
                }}
              >
                {cT}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div
        className={cs.canvas}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
        onMouseUp={handleMouseUp}
      >
        {constructState.constructs.map((construct, i) => {
          const ConstructComponent = ConstructByType[construct.type];
          const sourceId = constructState.connections.find(
            (conn) => conn.destId === construct.id
          )?.sourceId;
          let input;
          if (sourceId) {
            input = constructState.constructs.find(
              (c) => c.id === sourceId
            )?.output;
            console.log(input);
          }
          return (
            <ConstructComponent
              key={i}
              construct={construct}
              constructDispatch={constructDispatch}
              actionState={actionState}
              setActionState={setActionState}
              input={input}
            />
          );
        })}
      </div>
      <svg className={cs.canvas} style={{ pointerEvents: "none" }}>
        {actionState.state === States.ConnectingConstructs && (
          <g>
            <line
              ref={activeConnectionRef}
              x1={actionState.startX}
              y1={actionState.startY}
              // the following will be set by a plain javascript event listener in an effect
              x2={actionState.startX}
              y2={actionState.startY}
              stroke="black"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </g>
        )}
        {constructState.connections.map((connection, i) => {
          const sourceConstruct = constructState.constructs.find(
            (c) => c.id == connection.sourceId
          );
          const destConstruct = constructState.constructs.find(
            (c) => c.id == connection.destId
          );
          if (sourceConstruct && destConstruct) {
            return (
              <line
                key={i}
                x1={getOutletCoords(sourceConstruct).x}
                y1={getOutletCoords(sourceConstruct).y}
                x2={getInletCoords(destConstruct).x}
                y2={getInletCoords(destConstruct).y}
                stroke="black"
                strokeWidth={4}
                strokeLinecap="round"
              />
            );
          }
        })}
      </svg>
      {/* <svg
        className={cs.canvas}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {actionState.state === States.MovingConstruct && (
          <g>
            <line
              x1={actionState.startX}
              y1={actionState.startY}
              x2={mouse.x}
              y2={mouse.y}
              stroke="grey"
              strokeDasharray="2 4"
              strokeLinecap="round"
            />
          </g>
        )}
        {actionState.state === States.ConnectingConstructs && (
          <g>
            <line
              x1={actionState.startX}
              y1={actionState.startY}
              x2={mouse.x}
              y2={mouse.y}
              stroke="black"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </g>
        )}
        {constructState.connections.map((connection) => {
          const sourceConstruct = constructState.constructs.find(
            (c) => c.id == connection.sourceId
          );
          const destConstruct = constructState.constructs.find(
            (c) => c.id == connection.destId
          );
          if (sourceConstruct && destConstruct) {
            return (
              <line
                x1={getOutletCoords(sourceConstruct).x}
                y1={getOutletCoords(sourceConstruct).y}
                x2={getInletCoords(destConstruct).x}
                y2={getInletCoords(destConstruct).y}
                stroke="black"
                strokeWidth={4}
                strokeLinecap="round"
              />
            );
          }
        })}
        {constructState.constructs.map((construct) => (
          <g key={construct.id} className={cs.construct}></g>
        ))}
      </svg> */}
    </>
  );

  // function handleMouseDown(event: React.MouseEvent) {
  //   const {clientX, clientY} = event;
  //   if (actionState.state == States.Idle) {
  //     setActionState(makeConstructMenuPrimed({x: clientX, y: clientY}));
  //   }
  // }

  // function handleMouseUp(event: React.MouseEvent) {
  //   const {clientX, clientY} = event;
  //   // if (actionState.state === States.MovingConstruct) {
  //   //   constructDispatch({
  //   //     type: "move_construct",
  //   //     id: actionState.constructId,
  //   //     toX: clientX - actionState.offsetX,
  //   //     toY: clientY - actionState.offsetY,
  //   //   });
  //   //   setActionState(makeIdle());
  //   if (
  //     actionState.state == States.ConstructMenuPrimed &&
  //     actionState.x == clientX &&
  //     actionState.y == clientY
  //   ) {
  //     setActionState(makeConstructMenuOpened({x: clientX, y: clientY}));
  //   } else {
  //     setActionState(makeIdle());
  //   }
  // }

  function handleClick() {
    if (actionState.state === States.ConstructMenuOpened) {
      setActionState(makeIdle());
    }
  }

  function handleMouseUp() {
    if (actionState.state === States.ConnectingConstructs) {
      setActionState(makeIdle());
    }
  }

  function handleContextMenu(e: React.MouseEvent) {
    if (actionState.state == States.Idle) {
      e.preventDefault();
      setActionState(makeConstructMenuOpened({ x: e.clientX, y: e.clientY }));
    }
  }

  function handleCreateClick(
    _: React.MouseEvent,
    constructType: ConstructType
  ) {
    if (actionState && actionState.state === States.ConstructMenuOpened) {
      constructDispatch({
        type: "add_construct",
        construct: {
          type: constructType,
          id: constructState.constructs.length.toString(),
          style: {
            x: actionState!.x,
            y: actionState!.y,
            width: 180,
            height: 80,
          },
        },
      });
    }
    setActionState(makeIdle());
  }
}

function getOutletCoords(construct: Construct) {
  return {
    x: construct.style.x + construct.style.width,
    y: construct.style.y + construct.style.height / 2,
  };
}
function getInletCoords(construct: Construct) {
  return {
    x: construct.style.x,
    y: construct.style.y + construct.style.height / 2,
  };
}

export default App;
