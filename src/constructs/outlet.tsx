import {makeConnectingConstructs} from '../states';
import {BaseProps} from './base';
import cs from '../App.module.css';

type Props = BaseProps;
export default function Outlet({setActionState, construct}: Props) {
  return <div className={cs.outlet} onMouseDown={handleOutletMouseUp} />;

  function handleOutletMouseUp(e: React.MouseEvent) {
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
