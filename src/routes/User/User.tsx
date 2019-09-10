import TableTotal from "@components/Common/TableTotal";
import AddUser from "@components/User/AddUser";
import { DEFAULT_PAGE_SIZE } from "@config/constant";
import { DIALOG_TYPE } from "@definitions/global";
import { IState } from "@definitions/state";
import { RootAction } from "@definitions/types";
import { ReqAddUser, RoleModel, UserInfo, UserModel } from "@definitions/user/login";
import menuActionCreators from "@models/actions/menu";
import actionCreators, { IActionsM } from "@models/actions/user";
import { getRoleList } from "@services/auth/role";
import { OurDate } from "@utils/datetime";
import { Button, Divider, Drawer, Input, message, Pagination, Popconfirm, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import React from "react";
import { bindActionCreators, Dispatch } from "redux";
import styles from "./User.less";

const actions = actionCreators(true);
const menuActions = menuActionCreators(true);

const mapStateToProps = ({ user, home, menu }: IState) => ({
    userList: user.userList,
    userInfo: user.userInfo,
    query: home.query,
    menuList: menu.menuList,
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
    dispatch,
    actions: bindActionCreators<typeof actions, IActionsM>(actions, dispatch),
    menuActions: bindActionCreators(menuActions, dispatch),
});

interface IUserProps extends ReturnType<typeof mapDispatchToProps> { }

interface IUserProps extends ReturnType<typeof mapStateToProps> { }

interface IUserState {
    showAddDialog: boolean;
    dialogType: string;
    roleList: RoleModel[];
}

// 用于重置AddUser组件
let ADD_COUNT = 0;

const STATUS: {
    [index: number]: string,
} = {
    1: "正常",
    2: "禁用",
};

@connect(mapStateToProps, mapDispatchToProps)
export default class User extends React.Component<IUserProps, IUserState> {

    public columns: Array<ColumnProps<UserInfo>>;

    constructor(props: IUserProps) {
        super(props);
        this.getData = this.getData.bind(this);
        this.onToggleAddDialog = this.onToggleAddDialog.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onGoTo = this.onGoTo.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.getRoleData = this.getRoleData.bind(this);
        this.state = {
            showAddDialog: false,
            dialogType: DIALOG_TYPE.ADD,
            roleList: [],
        };
        this.columns = [{
            title: "编号",
            dataIndex: "ID",
            key: "ID",
        }, {
            title: "用户名",
            dataIndex: "Account",
            key: "Account",
        }, {
            title: "角色",
            dataIndex: "RoleName",
            key: "RoleName",
        }, {
            title: "创建时间",
            dataIndex: "CreatedAt",
            key: "CreatedAt",
            render: (text, record) => {
                return (new OurDate(text)).Format("yyyy-MM-dd hh:mm:ss");
            },
        }, {
            title: "更新时间",
            dataIndex: "UpdatedAt",
            key: "UpdatedAt",
            render: (text, record) => {
                return (new OurDate(text)).Format("yyyy-MM-dd hh:mm:ss");
            },
        }, {
            title: "状态",
            dataIndex: "Status",
            key: "Status",
            render: (text, record) => {
                return STATUS[text];
            },
        }, {
            title: "操作",
            key: "operator",
            render: (text, record) => {
                return (
                    <div className={styles.operator}>
                        <Button size="small" type="link" onClick={() => { this.onEdit(record.ID); }}>编辑</Button>
                        <Divider type="vertical" />
                        <Popconfirm placement="topLeft" title={`你确定要${record.Status === 1 ? "禁用" : "启用"}用户${record.Account}吗?`} onConfirm={() => this.onChangeStatus(record)} okText="确定" cancelText="取消">
                            <Button size="small" type="link" >{record.Status === 1 ? "禁用" : "启用"}</Button>
                        </Popconfirm>
                        <Divider type="vertical" />
                        <Popconfirm placement="topLeft" title={`你确定要删除用户${record.Account}吗?`} onConfirm={() => this.onDelete(record)} okText="确定" cancelText="取消">
                            <Button size="small" type="link" >删除</Button>
                        </Popconfirm>
                    </div>
                );
            },
        }];
    }

    public componentDidMount() {
        this.getData();
        this.getRoleData();
    }

    public componentWillReceiveProps(nextProps: IUserProps) {
        if (this.props.query.page !== nextProps.query.page
            || this.props.query.keyword !== nextProps.query.keyword) {
            this.getData(nextProps);
        }
    }

    public getData(props?: IUserProps) {
        const p = props ? props : this.props;
        const { query } = p;
        this.props.actions.getUserList({
            Search: query.keyword || "",
            Page: query.page || 1,
        });
    }

    public getRoleData() {
        getRoleList("").then((data) => {
            this.setState({
                roleList: data,
            });
        });
    }

    public onChangeStatus(u: UserModel) {
        const status = u.Status === 1 ? 2 : 1;
        this.props.actions.updateUserStatus({
            ID: u.ID,
            Status: status,
        }).then((res) => {
            if (res) {
                message.success("状态修改成功.");
                this.getData();
            }
        });
    }

    public onDelete(u: UserModel) {
        this.props.actions.delUser(u.ID).then(() => {
            message.success("删除成功.");
            this.getData();
        });
    }

    public onAdd() {
        this.onToggleAddDialog(true, DIALOG_TYPE.ADD);
    }

    public onEdit(id: number) {
        this.props.actions.getUserInfo(id).then(() => {
            this.onToggleAddDialog(true, DIALOG_TYPE.EDIT);
        });
    }

    public onSubmit(data: ReqAddUser) {
        const p = () => {
            this.getData();
            this.onToggleAddDialog(false);
        };
        if (this.state.dialogType === DIALOG_TYPE.ADD) {
            return this.props.actions.addUser({
                ...data,
            }).then(p).then(() => {
                ADD_COUNT++;
            });
        } else if (this.state.dialogType === DIALOG_TYPE.EDIT) {
            return this.props.actions.editUser({
                ...data,
            }).then(p);
        }
    }

    public onToggleAddDialog(show: boolean, type?: string) {
        this.setState({
            showAddDialog: show,
            dialogType: type || this.state.dialogType,
        });
    }

    public onGoTo(page: number, keyword?: string) {
        const { query } = this.props;
        const p = page || query.page || 1;
        const k = keyword === undefined ? query.keyword || "" : keyword;
        this.props.dispatch(routerRedux.push(`/layout/manager/user/list?page=${p}&keyword=${k}`));
    }

    public render() {
        const { userList, query } = this.props;
        const addKey = `${this.state.dialogType}-${this.props.userInfo.ID}-${ADD_COUNT}`;
        return (
            <div>
                <div>
                    <div className={styles.operator}>
                        <Button type="primary" onClick={() => { this.onAdd(); }}>创建管理员用户</Button>
                    </div>
                    <div className={styles.search}>
                        <Input.Search defaultValue={query.keyword} placeholder="搜索用户" onSearch={(value) => { this.onGoTo(1, value); }} />
                    </div>
                </div>
                <TableTotal total={userList.Total} />
                <Table
                    className={styles.table}
                    columns={this.columns}
                    dataSource={userList.Data}
                    pagination={false}
                    rowKey="ID"
                />
                <div className={styles.pagination}>
                    <Pagination
                        pageSize={DEFAULT_PAGE_SIZE}
                        total={userList.Total}
                        current={+query.page}
                        onChange={(page) => { this.onGoTo(page); }}
                        hideOnSinglePage
                    />
                </div>
                <Drawer
                    width={360}
                    visible={this.state.showAddDialog}
                    title={`${this.state.dialogType === DIALOG_TYPE.ADD ? "创建" : "编辑"}管理员用户`}
                    onClose={() => { this.onToggleAddDialog(false); }}
                    className={styles.drawer}
                >
                    <AddUser
                        key={addKey}
                        onSubmit={this.onSubmit}
                        type={this.state.dialogType}
                        item={this.props.userInfo}
                        roleList={this.state.roleList}
                    />
                </Drawer>
            </div>
        );
    }
}
