import React from 'react';
import {Construct, ConstructStateAction} from '.';
import cs from '../App.module.css';
import {ActionState, States, makeIdle, makeMovingConstruct} from '../states';

type Props = {
  construct: Construct;
  actionState: ActionState;
  setActionState: React.Dispatch<React.SetStateAction<ActionState>>;
  constructDispatch: React.Dispatch<ConstructStateAction>;
  children: React.ReactNode;
};
export type BaseProps = Omit<Props, 'children'>;

export default function ConstructBase({
  construct,
  actionState,
  setActionState,
  constructDispatch,
  children,
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const div = ref.current;
    if (actionState.state === States.MovingConstruct && actionState.constructId === construct.id) {
      const moveWithMouse = (event: MouseEvent) => {
        if (div && actionState.state === States.MovingConstruct) {
          div.style['transform'] = `translate(${event.clientX - actionState.startX}px, ${
            event.clientY - actionState.startY
          }px)`;
        }
      };

      window.addEventListener('mousemove', moveWithMouse);
      return () => {
        if (div) {
          div.style['transform'] = '';
        }
        window.removeEventListener('mousemove', moveWithMouse);
      };
    }
  }, [actionState, construct.id]);

  const {x, y, ...styleRest} = construct.style;
  return (
    <div
      ref={ref}
      className={cs.construct}
      style={{left: x, top: y, ...styleRest}}
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
        const {clientX, clientY} = e;
        if (actionState.state === States.MovingConstruct) {
          constructDispatch({
            type: 'move_construct',
            id: actionState.constructId,
            toX: clientX - actionState.offsetX,
            toY: clientY - actionState.offsetY,
          });
          setActionState(makeIdle());
        }
      }}
    >
      {children}
    </div>
  );
}
