import { LocationChangeAction, RouterAction } from "react-router-redux";
type ReactRouterAction = RouterAction | LocationChangeAction;

export type RootAction = ReactRouterAction;
