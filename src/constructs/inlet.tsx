import React from 'react';
import {States, makeIdle} from '../states';
import {BaseProps} from './base';
import cs from '../App.module.css';

type Props = BaseProps;
export default function Inlet({actionState, setActionState, construct, constructDispatch}: Props) {
  return <div className={cs.inlet} onMouseUp={handleInletMouseUp} />;

  function handleInletMouseUp(e: React.MouseEvent) {
    if (actionState.state === States.ConnectingConstructs) {
      e.stopPropagation();
      constructDispatch({
        type: 'connect_constructs',
        sourceId: actionState.sourceConstructId,
        destId: construct.id,
      });
      setActionState(makeIdle());
    }
  }
}
