import React from 'react';
import cs from '../App.module.css';
import ConstructBase, {BaseProps} from './base';
import {ElemArray} from '.';
import Outlet from './outlet';

type Props = BaseProps;

export default function SourceConstruct(props: Props) {
  const {construct, constructDispatch} = props;

  const [valStr, setValStr] = React.useState<string>('[1, 2, 3]');
  React.useEffect(() => {
    const val = tryParse(valStr);
    constructDispatch({type: 'set_construct_output', id: construct.id, value: val});
  }, [valStr, construct.id, constructDispatch]);

  const dims = [construct.output?.length];

  return (
    <ConstructBase {...props}>
      <div className={cs.constructType}>SOURCE</div>
      <input
        id={`output-${construct.id}`}
        type="text"
        value={valStr}
        onChange={(e) => setValStr(e.target.value)}
      />
      <div className={cs.dims}>SHAPE: {JSON.stringify(dims)}</div>
      <Outlet {...props} />
    </ConstructBase>
  );
}

function tryParse(valStr: string): ElemArray {
  try {
    return JSON.parse(valStr);
  } catch (error) {
    return [];
  }
}
