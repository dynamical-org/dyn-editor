import React from 'react';
import cs from '../App.module.css';
import {States, makeIdle} from '../states';
import ConstructBase, {BaseProps} from './base';
import {ElemArray} from '.';

type Props = BaseProps & {input: ElemArray};

type FnStrs = 'avg' | 'sum';

const Fns: {[key in FnStrs]: (arr: ElemArray) => ElemArray} = {
  avg: (arr: ElemArray) => arr.reduce((a, b) => a + b, 0) / arr.length,
  sum: (arr: ElemArray) => arr.reduce((a, b) => a + b, 0),
};

export default function OutputConstruct(props: Props) {
  const {input, construct, actionState, setActionState, constructDispatch} = props;

  const [fnStr, setFnStr] = React.useState<FnStrs>('avg');

  return (
    <ConstructBase {...props}>
      <div className={cs.constructType}>OUTPUT</div>
      <div
        className={cs.inlet}
        onMouseUp={(e) => {
          if (actionState.state === States.ConnectingConstructs) {
            e.stopPropagation();
            constructDispatch({
              type: 'connect_constructs',
              sourceId: actionState.sourceConstructId,
              destId: construct.id,
            });
            setActionState(makeIdle());
          }
        }}
      />
      <select
        value={fnStr}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onChange={(e) => {
          setFnStr(e.target.value as FnStrs);
        }}
      >
        <option value="avg">Avg</option>
        <option value="sum">Sum</option>
      </select>
      <div>{tryFn(input, Fns[fnStr])}</div>
    </ConstructBase>
  );
}

function tryFn(input: ElemArray, fn: (arr: ElemArray) => ElemArray) {
  try {
    const result = fn(input);
    console.log(result);
    return result;
  } catch (error) {
    console.error(input, error);
    return null;
  }
}
