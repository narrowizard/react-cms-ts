import { PagableData } from "@definitions/global";
import { ReqAddUser, ReqLogin, ReqUpdateStatus, ReqUserList, UserModel } from "@definitions/user/login";
import { NS } from "@models/user";
import { ActionCreator } from "redux";

export interface IActionsM {
    [index: string]: ActionCreator<any>;
    updateUserStatus: (params: ReqUpdateStatus) => Promise<boolean>;
    delUser: (id: number) => Promise<boolean>;
    editUser: (params: ReqAddUser) => Promise<void>;
}

function actionCreators(withNS?: boolean) {
    return {
        getUserList: (params: ReqUserList) => {
            return {
                type: `${withNS ? `${NS}/` : ""}getUserList`,
                payload: params,
            };
        },
        getUserInfo: (id: number) => {
            return {
                type: `${withNS ? `${NS}/` : ""}getUserInfo`,
                payload: id,
            };
        },
        addUser: (params: ReqAddUser) => {
            return {
                type: `${withNS ? `${NS}/` : ""}addUser`,
                payload: params,
            };
        },
        editUser: (params: ReqAddUser) => {
            return {
                type: `${withNS ? `${NS}/` : ""}editUser`,
                payload: params,
            };
        },
        updateUserStatus: (params: ReqUpdateStatus) => {
            return {
                type: `${withNS ? `${NS}/` : ""}updateUserStatus`,
                payload: params,
            };
        },
        delUser: (id: number) => {
            return {
                type: `${withNS ? `${NS}/` : ""}delUser`,
                payload: id,
            };
        },
        setUserList: (params: PagableData<UserModel>) => {
            return {
                type: `${withNS ? `${NS}/` : ""}setUserList`,
                payload: params,
            };
        },
        login: (params: ReqLogin) => {
            return {
                type: `${withNS ? `${NS}/` : ""}login`,
                payload: params,
            };
        },
    };
}

export default actionCreators;
