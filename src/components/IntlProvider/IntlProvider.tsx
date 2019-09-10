import { Spin } from "antd";
import * as React from "react";
import intl from "react-intl-universal";

import EnData from "../../locales/en-US";
import CnData from "../../locales/zh-CN";

// locale data
const locales: { [index: string]: {} } = {
    "en-US": EnData,
    "zh-CN": CnData,
};

interface IState {
    loadingLocales: boolean;
}

interface IProps {

}

export default class IntlProvider extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            loadingLocales: false,
        };
    }

    public componentDidMount() {
        this.setState({
            loadingLocales: true,
        });
        this.loadLocales();
    }

    public getCurrentLocale() {
        let currentLocale = intl.determineLocale({
            urlLocaleKey: "lang",
            cookieLocaleKey: "language",
        });
        if (!locales[currentLocale]) {
            currentLocale = "en-US";
        }
        return currentLocale;
    }

    public loadLocales() {
        intl.init({
            currentLocale: this.getCurrentLocale(),
            locales,
        }).then(() => {
            this.setState({
                loadingLocales: false,
            });
        });
    }

    public render() {
        const { children } = this.props;
        const { loadingLocales } = this.state;
        if (loadingLocales) {
            return (<Spin spinning={true} />);
        }
        return children;
    }
}
