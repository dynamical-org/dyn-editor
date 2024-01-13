import cs from './App.module.css';
import {useState, MouseEvent, useEffect, useReducer} from 'react';
import {
  ActionState,
  States,
  makeConnectingConstructs,
  makeIdle,
  makeMovingConstruct,
  makeConstructMenuOpened,
  makeConstructMenuPrimed,
} from './states';
import {Construct, ConstructType, constructReducer} from './constructs';
import {useMouse} from '@uidotdev/usehooks';

function App() {
  const [mouse] = useMouse();
  const [actionState, setActionState] = useState<ActionState>(makeIdle());
  const [constructState, constructDispatch] = useReducer(constructReducer, {
    constructs: [],
    connections: [],
  });

  useEffect(() => {
    console.log('actionState', actionState);
  }, [actionState]);
  useEffect(() => {
    console.log('constructs', constructState.constructs);
  }, [constructState.constructs]);

  return (
    <>
      {actionState?.state === States.ConstructMenuOpened && (
        <div className={cs.createMenu} style={{top: actionState.y, left: actionState.x}}>
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
      <svg className={cs.canvas} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        {actionState.state === States.MovingConstructs && (
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
          const destConstruct = constructState.constructs.find((c) => c.id == connection.destId);
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
          <g key={construct.id} className={cs.construct}>
            <rect
              data-construct-id={construct.id}
              {...construct.style}
              stroke="black"
              onMouseDown={handleConstructMouseDown}
            />
            <circle
              data-construct-id={construct.id}
              onMouseUp={handlePipeInletMouseUp}
              cx={getInletCoords(construct).x}
              cy={getInletCoords(construct).y}
              r={10}
              fill="green"
            />
            <circle
              data-construct-id={construct.id}
              onMouseDown={handlePipeOutletMouseDown}
              cx={getOutletCoords(construct).x}
              cy={getOutletCoords(construct).y}
              r={10}
              fill="red"
            />
          </g>
        ))}
      </svg>
    </>
  );

  function handleConstructMouseDown(event: MouseEvent<SVGRectElement>) {
    event.stopPropagation();
    const {clientX, clientY} = event;
    const construct = constructState.constructs.find(
      (c) => c.id == event.currentTarget.dataset['constructId']
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

  function handlePipeOutletMouseDown(event: MouseEvent<SVGCircleElement>) {
    event.stopPropagation();
    const {clientX, clientY} = event;
    const construct = constructState.constructs.find(
      (c) => c.id == event.currentTarget.dataset['constructId']
    );
    if (construct) {
      setActionState(
        makeConnectingConstructs({
          sourceConstructId: construct.id,
          startX: clientX,
          startY: clientY,
        })
      );
    }
  }

  function handlePipeInletMouseUp(event: MouseEvent<SVGCircleElement>) {
    event.preventDefault();
    const construct = constructState.constructs.find(
      (c) => c.id == event.currentTarget.dataset['constructId']
    );
    if (construct && actionState.state === States.ConnectingConstructs) {
      constructDispatch({
        type: 'connect_constructs',
        sourceId: actionState.sourceConstructId,
        destId: construct.id,
      });
    }
  }

  function handleMouseDown(event: MouseEvent) {
    const {clientX, clientY} = event;
    if (actionState.state == States.Idle) {
      setActionState(makeConstructMenuPrimed({x: clientX, y: clientY}));
    }
  }

  function handleMouseUp(event: MouseEvent) {
    const {clientX, clientY} = event;
    if (actionState.state === States.MovingConstructs) {
      constructDispatch({
        type: 'move_construct',
        id: actionState.constructId,
        toX: clientX - actionState.offsetX,
        toY: clientY - actionState.offsetY,
      });
      setActionState(makeIdle());
    } else if (
      actionState.state == States.ConstructMenuPrimed &&
      actionState.x == clientX &&
      actionState.y == clientY
    ) {
      setActionState(makeConstructMenuOpened({x: clientX, y: clientY}));
    } else {
      setActionState(makeIdle());
    }
  }

  function handleCreateClick(_: MouseEvent, constructType: ConstructType) {
    if (actionState && actionState.state === States.ConstructMenuOpened) {
      constructDispatch({
        type: 'add_construct',
        construct: {
          type: constructType,
          id: constructState.constructs.length.toString(),
          style: {
            x: actionState!.x,
            y: actionState!.y,
            width: 200,
            height: 100,
          },
        },
      });
    }
    setActionState(makeIdle());
  }
}

function getOutletCoords(construct: Construct) {
  return {
    x: construct.style.x + construct.style.width - 20,
    y: construct.style.y + construct.style.height / 2,
  };
}
function getInletCoords(construct: Construct) {
  return {
    x: construct.style.x + 20,
    y: construct.style.y + construct.style.height / 2,
  };
}

export default App;
