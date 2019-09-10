import { Route, Switch } from "dva/router";
import React from "react";
import Info from "./Info";
import Level from "./Level";

export default class Index extends React.Component {

    public render() {
        return (
            <Switch>
                <Route path="/level" exact component={Level} />
                <Route path="/level/info/:id?" exact component={Info} />
            </Switch>
        );
    }
}
