import React from "react";
import cs from "../App.module.css";
import ConstructBase, { BaseProps } from "./base";
import { ElemArray } from ".";
import Inlet from "./inlet";
import Outlet from "./outlet";

type Props = BaseProps & { input: ElemArray };

export default function OuptutConstruct(props: Props) {
  const { input, construct, constructDispatch } = props;

  return (
    <ConstructBase {...props}>
      <Inlet {...props} />
      <div className={cs.constructType}>OUPTUT</div>
    </ConstructBase>
  );
}
