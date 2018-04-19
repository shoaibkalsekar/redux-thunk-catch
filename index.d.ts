import { Middleware, Dispatch } from "redux";

export type ThunkAction<R, S, E> = (dispatch: Dispatch<S>, getState: () => S,
    extraArgument: E) => R;

declare module "redux" {
    export interface Dispatch<S> {
        <R, E>(asyncAction: ThunkAction<R, S, E>): R;
    }
}

declare type ErrorHandler = (error: any, state: any, action: any, dispatch: any) => void;

declare const createThunkMiddleware: (errorHandler: ErrorHandler, extraArgument: any) => Middleware;

export default createThunkMiddleware;
