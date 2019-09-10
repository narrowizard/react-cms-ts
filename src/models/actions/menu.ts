import { MenuListItem } from "@definitions/menu/menu";
import { NS } from "@models/menu";

function actionCreators(withNS?: boolean) {
    return {
        addMenu: (params: MenuListItem) => {
            return {
                type: `${withNS ? `${NS}/` : ""}addMenu`,
                payload: params,
            };
        },
        getMenu: () => {
            return {
                type: `${withNS ? `${NS}/` : ""}getMenu`,
            };
        },
        editMenu: (params: MenuListItem) => {
            return {
                type: `${withNS ? `${NS}/` : ""}editMenu`,
                payload: params,
            };
        },
        setMenu: (data: MenuListItem[]) => {
            return {
                type: `${withNS ? `${NS}/` : ""}setMenu`,
                payload: data,
            };
        },
        setMenuOrigin: (data: MenuListItem[]) => {
            return {
                type: `${withNS ? `${NS}/` : ""}setMenuOrigin`,
                payload: data,
            };
        },
        deleteMenu: (id: number) => {
            return {
                type: `${withNS ? `${NS}/` : ""}deleteMenu`,
                payload: {
                    id,
                },
            };
        },
    };
}

export default actionCreators;
