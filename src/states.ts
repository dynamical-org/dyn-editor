import { Construct } from "./constructs";

export enum States {
  Idle,
  ConstructMenuPrimed,
  ConstructMenuOpened,
  MovingConstructs,
  ConnectingConstructs,
}

export type StateCreateMenuPrimed = {
  state: States.ConstructMenuPrimed;
  x: number;
  y: number;
};

export type StateCreateMenuOpen = {
  state: States.ConstructMenuOpened;
  x: number;
  y: number;
};

export type StateMoveConstruct = {
  state: States.MovingConstructs;
  constructId: Construct["id"];
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
};

export type StateConnectConstruct = {
  state: States.ConnectingConstructs;
  sourceConstructId: Construct["id"];
  startX: number;
  startY: number;
};

export type ActionState =
  | { state: States.Idle }
  | StateCreateMenuPrimed
  | StateCreateMenuOpen
  | StateMoveConstruct
  | StateConnectConstruct;

export function makeIdle(): ActionState {
  return { state: States.Idle };
}

export function makeConstructMenuPrimed(
  props: Omit<StateCreateMenuPrimed, "state">,
): ActionState {
  return { state: States.ConstructMenuPrimed, ...props };
}

export function makeConstructMenuOpened(
  props: Omit<StateCreateMenuOpen, "state">,
): ActionState {
  return { state: States.ConstructMenuOpened, ...props };
}

export function makeMovingConstruct(
  props: Omit<StateMoveConstruct, "state">,
): ActionState {
  return { state: States.MovingConstructs, ...props };
}

export function makeConnectingConstructs(
  props: Omit<StateConnectConstruct, "state">,
): ActionState {
  return { state: States.ConnectingConstructs, ...props };
}
