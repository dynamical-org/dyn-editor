export enum ConstructType {
  Source = "Source",
  Model = "Model",
  Transform = "Transform",
  Output = "Ouptut",
}

export type Construct = {
  type: ConstructType;
  id: string;
  style: Pick<SVGRect, "x" | "y" | "width" | "height"> & Partial<SVGRect>;
};

type ConstructConnection = {
  sourceId: Construct["id"];
  destId: Construct["id"];
};

export type ConstructState = {
  constructs: Construct[];
  connections: ConstructConnection[];
};
type ActionAddConstruct = {
  type: "add_construct";
  construct: Construct;
};
type ActionMoveConstruct = {
  type: "move_construct";
  id: Construct["id"];
  toX: number;
  toY: number;
};
type ConnectConstructs = {
  type: "connect_constructs";
  sourceId: Construct["id"];
  destId: Construct["id"];
};
export type ConstructStateAction =
  | ActionAddConstruct
  | ActionMoveConstruct
  | ConnectConstructs;
export function constructReducer(
  state: ConstructState,
  action: ConstructStateAction,
) {
  console.log(action.type);
  if (action.type === "add_construct") {
    return { ...state, constructs: [...state.constructs, action.construct] };
  }
  if (action.type === "move_construct") {
    const i = state.constructs.findIndex((c) => c.id === action.id);
    if (i > -1) {
      state.constructs[i].style.x = action.toX;
      state.constructs[i].style.y = action.toY;
    }
  }
  if (action.type === "connect_constructs") {
    return {
      ...state,
      connections: [...state.connections, {
        sourceId: action.sourceId,
        destId: action.destId,
      }],
    };
  }
  return state;
}

// export function checkForCollision(
//   constructs: Construct[],
//   x: number,
//   y: number,
// ): { construct: Construct; isPipe: boolean } {
//   for (let i = 0; i < constructs.length; i++) {
//     const construct = constructs[i];
//     const { x: cX, y: cY, width: cWidth, height: cHeight } = construct.style;

//     if (x >= cX && x <= cX + cWidth && y >= cY && y <= cY + cHeight) {
//       return { construct };
//     }
//   }
// }
