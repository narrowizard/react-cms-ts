import { RootAction } from "@definitions/types";
import { routerRedux } from "dva/router";
import React from "react";
import { Dispatch } from "redux";

interface IBackableLayoutProps {
    path?: string;
    dispatch: Dispatch<RootAction>;
}

export default class BackableLayout extends React.Component<IBackableLayoutProps> {

    constructor(props: IBackableLayoutProps) {
        super(props);
        this.onBack = this.onBack.bind(this);
    }

    public onBack() {
        const { path } = this.props;
        if (path) {
            this.props.dispatch(routerRedux.push(path));
            return;
        }
        history.back();
    }

    public render() {
        const { children } = this.props;
        return (
            <div>
                <div>
                    <a href="#" onClick={this.onBack}>&lt; 返回</a>
                </div>
                {children}
            </div>
        );
    }
}
