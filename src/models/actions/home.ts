import { ReqUpdatePassword, UserInfo } from "@definitions/user/login";
import { NS } from "@models/home";
import { ActionCreator } from "redux";

export interface IActionsM {
    [index: string]: ActionCreator<any>;
    logout: () => Promise<void>;
    updatePassword: (params: ReqUpdatePassword) => Promise<void>;
}

function actionCreators(withNS?: boolean) {
    return {
        setQuery(query: any) {
            return {
                type: `${withNS ? `${NS}/` : ""}setQuery`,
                payload: query,
            };
        },
        getUserMenu() {
            return {
                type: `${withNS ? `${NS}/` : ""}getUserMenu`,
            };
        },
        setUserInfo(u: UserInfo) {
            return {
                type: `${withNS ? `${NS}/` : ""}setUserInfo`,
                payload: u,
            };
        },
        logout() {
            return {
                type: `${withNS ? `${NS}/` : ""}logout`,
            };
        },
        updatePassword(params: ReqUpdatePassword) {
            return {
                type: `${withNS ? `${NS}/` : ""}updatePassword`,
                payload: params,
            };
        },
    };
}

export default actionCreators;
