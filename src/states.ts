import { Construct } from "./constructs";

export enum States {
  Idle,
  OpenCreate,
  MoveConstruct,
  ConnectConstruct,
}

export type StateOpenCreate = {
  state: States.OpenCreate;
  x: number;
  y: number;
};

export type StateMoveConstruct = {
  state: States.MoveConstruct;
  constructId: Construct["id"];
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
};

export type StateConnectConstruct = {
  state: States.ConnectConstruct;
  sourceConstructId: Construct["id"];
  startX: number;
  startY: number;
};

export type ActionState =
  | { state: States.Idle }
  | StateOpenCreate
  | StateMoveConstruct
  | StateConnectConstruct;

export function makeIdle(): ActionState {
  return { state: States.Idle };
}

export function makeOpenCreate(
  props: Omit<StateOpenCreate, "state">,
): ActionState {
  return { state: States.OpenCreate, ...props };
}

export function makeMoveConstruct(
  props: Omit<StateMoveConstruct, "state">,
): ActionState {
  return { state: States.MoveConstruct, ...props };
}

export function makeConnectConstruct(
  props: Omit<StateConnectConstruct, "state">,
): ActionState {
  return { state: States.ConnectConstruct, ...props };
}
