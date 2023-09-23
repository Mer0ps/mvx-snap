import { IPlainTransactionObject } from "@multiversx/sdk-core/out";
import { SnapState } from "./snapState";

export interface ApiParams {
    state: SnapState;
    snapParams: SnapRequestParams;
}

export type SnapRequestParams =
  | GetBalanceParams
  | SendTransactionParams;


export interface BaseParams {
    chainId?: string;
}

export interface GetBalanceParams extends BaseParams {}

export interface SendTransactionParams extends IPlainTransactionObject, Omit<BaseParams, 'chainId'> {}