
import { DvaInstance } from "dva";
import { Route, routerRedux, Switch } from "dva/router";
import * as H from "history";
import moment from "moment";
import "moment/locale/zh-cn";
import * as React from "react";

moment.locale("zh-cn");

import getRouters, { getRouter } from "./config/routes";

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history, app }: { history: H.History, app: DvaInstance }): JSX.Element {

    const routerData = getRouters(app);
    const login = getRouter(routerData, "Login");
    const main = getRouter(routerData, "Main");
    if (!main || !login) {
        const error = "router main/login is not defined! please check your router config in config/routes.ts";
        throw error;
    }
    return (
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/login" component={login.component} />
                <Route path={main.path} component={main.component} />
            </Switch>
        </ConnectedRouter>
    );
}

export default RouterConfig;
