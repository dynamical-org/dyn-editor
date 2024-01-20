import React from "react";
import cs from "../App.module.css";
import ConstructBase, { BaseProps } from "./base";
import { ElemArray } from ".";
import Outlet from "./outlet";
import ObsResult from "../data/obs_result.json";

const data = [
  ObsResult.data[0].map((dStr) => new Date(dStr)), // dates
  ObsResult.data[1], // temperature
  ObsResult.data[2], // precip
];

type Props = BaseProps;

export default function SourceConstruct(props: Props) {
  const { construct, constructDispatch } = props;

  React.useEffect(() => {
    constructDispatch({
      type: "set_construct_output",
      id: construct.id,
      value: data.data,
    });
  }, [construct.id, constructDispatch]);

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
