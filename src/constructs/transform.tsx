import React from 'react';
import cs from '../App.module.css';
import {States, makeIdle} from '../states';
import ConstructBase, {BaseProps} from './base';
import {ElemArray} from '.';
import Inlet from './inlet';
import Outlet from './outlet';

type Props = BaseProps & {input: ElemArray};

type FnStrs = 'avg' | 'sum' | 'inc';

const Fns: {[key in FnStrs]: (arr: ElemArray) => ElemArray} = {
  avg: (arr: ElemArray) => arr.reduce((a, b) => a + b, 0) / arr.length,
  sum: (arr: ElemArray) => arr.reduce((a, b) => a + b, 0),
  inc: (arr: ElemArray) => arr.map((a) => a + 1),
};

export default function TransformConstruct(props: Props) {
  const {input, construct, constructDispatch} = props;

  const [fnStr, setFnStr] = React.useState<FnStrs>('avg');
  React.useEffect(() => {
    const val = tryFn(input, Fns[fnStr]) || [];
    constructDispatch({type: 'set_construct_output', id: construct.id, value: val});
  }, [input, construct.id, constructDispatch, fnStr]);
  const dims = construct.output?.length ? [construct.output.length] : 1;

  return (
    <ConstructBase {...props}>
      <Inlet {...props} />
      <div className={cs.constructType}>TRANSFORM</div>
      <select
        value={fnStr}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onChange={(e) => {
          setFnStr(e.target.value as FnStrs);
        }}
      >
        <option value="avg">Average</option>
        <option value="sum">Sum</option>
        <option value="inc">Increment</option>
      </select>
      <div>{JSON.stringify(construct.output)}</div>
      <div className={cs.dims}>SHAPE: {JSON.stringify(dims)}</div>
      <Outlet {...props} />
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
