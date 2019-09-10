import { IDynamicRouteInfo, IRouterDataItem } from "@definitions/global";
import { DvaInstance } from "dva";
import dynamic from "dva/dynamic";
import React from "react";

let routerData: IRouterDataItem[];

const modelNotExisted = (app: DvaInstance, model: string) =>
    // eslint-disable-next-line
    !app._models
        .some(({ namespace }: { namespace: string }) => namespace === model.substring(model.lastIndexOf("/") + 1));

const dynamicWrapper = (app: DvaInstance, item: IDynamicRouteInfo) => {
    return dynamic({
        app,
        models: () => item.models.filter((m) => modelNotExisted(app, m)).map((m) => import(`../models/${m}`)),
        component: () => {
            return item.component().then((raw) => {
                if (!routerData) {
                    routerData = getRouters(app);
                }
                const component = raw.default || raw;
                const d = (props: any) => {
                    return React.createElement(component, {
                        ...props,
                        routerData,
                    });
                };
                return d;
            });
        },
    });
};

// routes.ts
// 路由配置
const getRouters: (app: DvaInstance) => IRouterDataItem[] = (app) => ([
    {
        name: "Main",
        path: "/",
        component: dynamicWrapper(app, {
            models: ["home"],
            component: () => import("../routes/Home"),
        }),
    },
    {
        name: "Login",
        path: "/login",
        exact: true,
        component: dynamicWrapper(app, {
            models: ["user", "home"],
            component: () => import("../routes/Login"),
        }),
    },
    {
        name: "Welcome",
        path: "/",
        exact: true,
        component: dynamicWrapper(app, {
            models: [],
            component: () => import("../routes/Welcome"),
        }),
    },
    {
        name: "Center",
        path: "/center",
        exact: true,
        component: dynamicWrapper(app, {
            models: [],
            component: () => import("../routes/Center"),
        }),
    },
    {
        name: "菜单管理",
        path: "/layout/manager/module",
        component: dynamicWrapper(app, {
            models: ["menu"],
            component: () => import("../routes/Menu"),
        }),
    },
    {
        name: "管理员管理",
        path: "/layout/manager/user",
        component: dynamicWrapper(app, {
            models: ["menu", "user"],
            component: () => import("../routes/User"),
        }),
    },
    {
        name: "角色管理",
        path: "/layout/manager/role",
        component: dynamicWrapper(app, {
            models: ["home"],
            component: () => import("../routes/Role"),
        }),
    },
]);

const getRouter = (routers: IRouterDataItem[], name: string) => {
    const items = routers.filter((item) => item.name === name);
    if (items && items.length > 0) {
        return items[0];
    }
    return null;
};

export {
    getRouter,
};

export default getRouters;
