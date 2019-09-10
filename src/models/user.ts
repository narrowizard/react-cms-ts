import { IModel, PagableData } from "@definitions/global";
import { IUser } from "@definitions/state";
import { ReqAddUser, ReqLogin, ReqUpdateStatus, ReqUserList, UserInfo, UserModel } from "@definitions/user/login";
import { createUser, deleteUser, getUserInfo, getUserList, login, updateUserModules, updateUserStatus } from "@services/auth/user";
import { EffectsCommandMap } from "dva";
import { AnyAction } from "redux";
import homeActionCreators from "./actions/home";
import actionCreators from "./actions/user";

export const NS = "user";

const M: IModel & {
    state: IUser,
} = {
    namespace: NS,

    state: {
        userList: new PagableData(),
        userInfo: new UserInfo(),
    },

    effects: {
        *login({ payload }: { payload: ReqLogin }, { call, put }: EffectsCommandMap) {
            const data: UserInfo = yield call(login, payload.Account, payload.Password);
            if (data) {
                yield put(homeActionCreators(true).setUserInfo(data));
            }
        },
        *getUserList({ payload }: { payload: ReqUserList }, { call, put }: EffectsCommandMap) {
            const data: PagableData<UserModel> = yield call(getUserList, payload.Page, payload.Search);
            if (data) {
                yield put(actionCreators(false).setUserList(data));
            }
        },
        *addUser({ payload }: { payload: ReqAddUser }, { call, put }: EffectsCommandMap) {
            const data = yield call(createUser, payload);
            if (data) {
                const userInfo = JSON.parse(data);
                return userInfo;
            }
        },
        *getUserInfo({ payload }: { payload: number }, { call, put }: EffectsCommandMap) {
            const data = yield call(getUserInfo, payload);
            yield put({
                type: "setUserInfo",
                payload: data,
            });
        },
        *editUser({ payload }: { payload: ReqAddUser }, { call, put }: EffectsCommandMap) {
            const data = yield call(updateUserModules, payload.ID, payload.RoleID);
            if (data) {
                return true;
            }
            return false;
        },
        *updateUserStatus({ payload }: { payload: ReqUpdateStatus }, { call }: EffectsCommandMap) {
            return yield call(updateUserStatus, payload.ID, payload.Status);
        },
        *delUser({ payload }: { payload: number }, { call }: EffectsCommandMap) {
            return yield call(deleteUser, payload);
        },
    },
    reducers: {
        setUserInfo(state: IUser, { payload }: AnyAction) {
            return { ...state, userInfo: payload };
        },
        setUserList(state: IUser, { payload }: AnyAction) {
            return { ...state, userList: payload };
        },
    },
};

export default M;
