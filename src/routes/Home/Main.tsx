import { IRouterDataItem } from "@definitions/global";
import { MenuListItem } from "@definitions/menu/menu";
import { IState } from "@definitions/state";
import { RootAction } from "@definitions/types";
import actionCreators, { IActionsM } from "@models/actions/home";
import { Icon, Layout, Menu, Modal } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import classnames from "classnames";
import { connect } from "dva";
import { Link, Route, Switch } from "dva/router";
import React from "react";
import { bindActionCreators, Dispatch } from "redux";
import styles from "./Main.less";
import UpdatePassword from "./UpdatePassword";

const { Sider, Header, Content } = Layout;

const actions = actionCreators(true);

interface IMainState {
    collapsed: boolean;
    modal: string;
    updatePasswordModalId: number;
    isMobile: boolean;
}

const mapStateToProps = ({ home }: IState) => ({
    userInfo: home.userInfo,
    menuList: home.userMenus,
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
    dispatch,
    actions: bindActionCreators<typeof actions, IActionsM>(actions, dispatch),
});

interface IMainProps extends ReturnType<typeof mapDispatchToProps> {
    routerData: IRouterDataItem[];
    location: Location;
}

interface IMainProps extends ReturnType<typeof mapStateToProps> {

}

@connect(mapStateToProps, mapDispatchToProps)
export default class Main extends React.Component<IMainProps, IMainState> {

    constructor(props: IMainProps) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.getSelectedKey = this.getSelectedKey.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.onShowModal = this.onShowModal.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.state = {
            collapsed: false,
            modal: "",
            updatePasswordModalId: 1,
            isMobile: false,
        };
    }

    public componentDidMount() {
        this.props.actions.getUserMenu();
    }

    public toggle() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    public getSelectedKey(menuList: MenuListItem[]): string[] {
        const { location } = this.props;
        let selectedKeys: string[] = [];
        menuList.forEach((item) => {
            if (item.Children && item.Children.length > 0) {
                const keys = this.getSelectedKey(item.Children);
                if (keys && keys.length > 0) {
                    selectedKeys = selectedKeys.concat(keys);
                }
            }
            if (location.pathname.indexOf(item.URL) > -1) {
                selectedKeys.push(`${item.ID}`);
            }
        });
        return selectedKeys;
    }

    public getOpenKey(menuList: MenuListItem[]): string[] {
        const { location } = this.props;
        let openKeys: string[] = [];
        menuList.forEach((item) => {
            if (item.Children && item.Children.length > 0) {
                const keys = this.getOpenKey(item.Children);
                if (keys && keys.length > 0) {
                    openKeys = openKeys.concat(keys);
                }
            }
            // NOTICE: 这里要求子菜单的路由是以父菜单为前缀的
            if (location.pathname.indexOf(item.URL) > -1) {
                openKeys.push(`${item.ID}`);
            }
        });
        return openKeys;
    }

    public renderMenu(data: MenuListItem[]) {
        if (!data || data.length === 0) {
            return [];
        }
        const menu = data.map((item) => {
            if (item.Children && item.Children.length > 0) {
                return <SubMenu
                    key={`${item.ID}`}
                    title={<span>{item.Icon ? <Icon type={item.Icon} /> : null}<span>{item.Name}</span></span>}
                >
                    {this.renderMenu(item.Children)}
                </SubMenu>;
            } else if (item.URL) {
                return (<Menu.Item key={`${item.ID}`}>
                    <Link to={item.URL}><span>{item.Icon ? <Icon type={item.Icon} /> : null}<span>{item.Name}</span></span></Link>
                </Menu.Item>);
            }
            return null;
        });
        return menu;
    }

    public onCloseModal() {
        this.setState({
            modal: "",
            updatePasswordModalId: this.state.updatePasswordModalId + 1,
        });
    }

    public onLogout() {
        this.props.actions.logout().then(() => {
            window.location.href = "/login";
        });
    }

    public onShowModal(modal: string) {
        this.setState({
            modal,
        });
    }

    public render() {
        const { routerData, menuList } = this.props;
        const selectedKeys = this.getSelectedKey(menuList);
        const openKeys = this.getOpenKey(menuList);
        return (
            <Layout className={classnames(styles.main, {
                [styles.mobile]: this.state.isMobile,
            })}>
                <Sider
                    breakpoint="lg"
                    collapsedWidth={this.state.isMobile ? 0 : undefined}
                    theme="dark"
                    onBreakpoint={(broken) => {
                        this.setState({
                            isMobile: broken,
                        });
                    }}
                    collapsible
                // collapsed={this.state.collapsed}
                >
                    <div className={styles.logo} />
                    {
                        this.props.menuList && this.props.menuList.length > 0 &&
                        <Menu
                            theme="dark"
                            mode="inline"
                            defaultOpenKeys={openKeys}
                            defaultSelectedKeys={selectedKeys}
                        >
                            {
                                this.renderMenu(this.props.menuList)
                            }
                        </Menu>
                    }
                </Sider>
                <Layout>
                    <Header className={styles.header}>
                        {/* <Icon
                            className={styles.trigger}
                            type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                            onClick={this.toggle}
                        /> */}
                        <div className={styles.userInfo}>
                            <a href="#" onClick={() => { this.onShowModal("password"); }} >修改密码</a> &nbsp;&nbsp;
                            <a href="#" onClick={this.onLogout}>退出登录</a>
                        </div>
                    </Header>
                    <Content
                        className={styles.content}
                    >
                        <Switch>
                            {
                                // manually except Main component
                                routerData.filter((item) => item.name !== "Main").map((item) => (
                                    <Route
                                        key={item.name}
                                        path={item.path}
                                        exact={item.exact}
                                        render={(props) => {
                                            return React.createElement(item.component, props);
                                        }} />
                                ))
                            }
                        </Switch>
                    </Content>
                </Layout>
                <Modal
                    visible={this.state.modal === "password"}
                    onCancel={this.onCloseModal}
                    title="修改密码"
                    footer={null}
                >
                    <UpdatePassword
                        key={this.state.updatePasswordModalId}
                        onUpdatePassword={this.props.actions.updatePassword}
                        onClose={this.onCloseModal}
                    />
                </Modal>
            </Layout>
        );
    }
}
