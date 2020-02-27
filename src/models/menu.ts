
import { IModel } from "@definitions/global";
import { MenuListItem, MenuModel } from "@definitions/menu/menu";
import { IMenu } from "@definitions/state";
import { deleteModule, getModules, newModule, updateModule } from "@services/auth/menu";
import { ListTree } from "@utils/tools";
import { EffectsCommandMap } from "dva";
import { AnyAction } from "redux";
import actionCreators from "./actions/menu";

export const NS = "menu";

const M: IModel & {
    state: IMenu,
} = {
    namespace: NS,

    state: {
        menuListOrigin: [],
        menuList: [],
    },

    effects: {
        *addMenu({ payload }: { payload: MenuModel }, { call, put }: EffectsCommandMap) {
            const data = yield call(newModule, payload);
            if (data) {
                // TODO: 添加成功
            }
        },
        *getMenu(params: any, { call, put }: EffectsCommandMap) {
            const data: MenuListItem[] = yield call(getModules);
            if (data) {
                const treeData = new ListTree(data).getTreeData();
                yield put(actionCreators().setMenu(treeData));
                yield put(actionCreators().setMenuOrigin(data));
            }
        },
        *deleteMenu({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
            const data = yield call(deleteModule, payload.id);
            if (data) {
                // TODO: 删除成功
            }
        },
        *editMenu({ payload }: { payload: MenuModel }, { call, put }: EffectsCommandMap) {
            const data = yield call(updateModule, payload);
            if (data) {
                // TODO: 编辑成功
            }
        },
    },
    reducers: {
        setMenuOrigin(state: IMenu, { payload }: AnyAction) {
            return {
                ...state,
                menuListOrigin: payload,
            };
        },
        setMenu(state: IMenu, { payload }: AnyAction) {
            return {
                ...state,
                menuList: payload,
            };
        },
    },
};

export default M;
