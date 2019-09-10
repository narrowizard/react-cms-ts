import { IModel } from "@definitions/global";
import { IHome } from "@definitions/state";
import { RootAction } from "@definitions/types";
import { ReqUpdatePassword, UserInfo } from "@definitions/user/login";
import { getUserModules } from "@services/auth/menu";
import { logout, updatePassword } from "@services/auth/user";
import { EffectsCommandMap } from "dva";
import { History } from "history";
import qs from "querystring";
import { AnyAction, Dispatch } from "redux";
import actionCreators from "./actions/home";

export const NS = "home";

const M: IModel & {
    state: IHome,
} = {
    namespace: NS,

    subscriptions: {
        setup({ dispatch, history }: { dispatch: Dispatch<RootAction>, history: History }) {
            return history.listen(({ pathname, search }) => {
                const query = qs.parse(search.substr(1));
                dispatch(actionCreators(false).setQuery(query));
            });
        },
    },

    state: {
        query: {},
        userMenus: [],
        userInfo: new UserInfo(),
    },

    effects: {
        *getUserMenu({ }, { call, put }: EffectsCommandMap) {
            const data = yield call(getUserModules);
            if (data) {
                yield put({
                    type: "setUserMenus",
                    payload: data,
                });
            }
        },
        *logout({ }, { call, put }: EffectsCommandMap) {
            return yield call(logout);
        },
        *updatePassword({ payload }: { payload: ReqUpdatePassword }, { call, put }: EffectsCommandMap) {
            const data = yield call(updatePassword, payload);
            return data;
        },
    },
    reducers: {
        setQuery(state: IHome, { payload }: AnyAction) {
            return {
                ...state,
                query: payload,
            };
        },
        setUserMenus(state: IHome, { payload }: AnyAction) {
            return {
                ...state,
                userMenus: payload,
            };
        },
        setUserInfo(state: IHome, { payload }: AnyAction) {
            return {
                ...state,
                userInfo: payload,
            };
        },
    },
};

export default M;
