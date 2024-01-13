import React from 'react';
import cs from '../App.module.css';
import {makeConnectingConstructs} from '../states';
import ConstructBase, {BaseProps} from './base';
import {ElemArray} from '.';

type Props = BaseProps;

export default function SourceConstruct(props: Props) {
  const {construct, setActionState, constructDispatch} = props;

  const [arrStr, setArrStr] = React.useState<string>('[1, 2, 3]');
  const arr = tryParse(arrStr);
  React.useEffect(() => {
    constructDispatch({type: 'set_construct_output', id: construct.id, value: arr});
  }, [arr, construct.id, constructDispatch]);

  const dims = [arr.length];

  return (
    <ConstructBase {...props}>
      <div className={cs.constructType}>SOURCE</div>
      <input
        id={`output-${construct.id}`}
        type="text"
        value={arrStr}
        onChange={(e) => setArrStr(e.target.value)}
      />
      <div className={cs.dims}>SHAPE: [{dims.join(',')}]</div>
      <div className={cs.outlet} onMouseDown={handleOutputDrag} />
    </ConstructBase>
  );

  function handleOutputDrag(e: React.MouseEvent) {
    e.stopPropagation();
    const {clientX, clientY} = e;
    setActionState(
      makeConnectingConstructs({
        sourceConstructId: construct.id,
        startX: clientX,
        startY: clientY,
      })
    );
  }
}

function tryParse(arrStr: string): ElemArray {
  try {
    return JSON.parse(arrStr);
  } catch (error) {
    return [];
  }
}
