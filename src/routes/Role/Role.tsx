import { MenuListItem } from "@definitions/menu/menu";
import { IState } from "@definitions/state";
import { RoleModel } from "@definitions/user/login";
import { getModules } from "@services/auth/menu";
import { getRoleList, newRole, updateRole, updateRoleStatus } from "@services/auth/role";
import { OurDate } from "@utils/datetime";
import { Button, Divider, Drawer, message, Popconfirm } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { connect } from "dva";
import React from "react";
import styles from "./Role.less";
import RoleEditView from "./RoleEditView";

const mapStateToProps = (state: IState) => ({
    query: state.home.query,
});

const STATUS: {
    [index: number]: string,
} = {
    1: "正常",
    2: "禁用",
};

interface IRoleProps extends ReturnType<typeof mapStateToProps> {

}

interface IRoleState {
    list: RoleModel[];
    modal: string;
    roleInfo: RoleModel | null;
    menus: MenuListItem[];
    loading: boolean;
}

let ADD_KEY = 1;

@connect(mapStateToProps)
export default class Role extends React.Component<IRoleProps, IRoleState> {

    public columns: Array<ColumnProps<RoleModel>>;

    constructor(props: IRoleProps) {
        super(props);
        this.getData = this.getData.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onShowModal = this.onShowModal.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onEditRole = this.onEditRole.bind(this);
        this.onAddRole = this.onAddRole.bind(this);
        this.columns = [{
            title: "编号",
            dataIndex: "ID",
        }, {
            title: "名称",
            dataIndex: "Name",
        }, {
            title: "更新时间",
            dataIndex: "CreatedAt",
            render: (text) => (
                (new OurDate(text)).Format("yyyy-MM-dd hh:mm:ss")
            ),
        }, {
            title: "状态",
            dataIndex: "Status",
            render: (text) => (
                STATUS[+text]
            ),
        }, {
            title: "操作",
            key: "operator",
            render: (text, record) => (
                <div className={styles.operator}>
                    <Button size="small" type="link" onClick={() => { this.onEdit(record); }}>编辑</Button>
                    <Divider type="vertical" />
                    <Popconfirm placement="topLeft" title={`你确定要${record.Status === 1 ? "禁用" : "启用"}角色${record.Name}吗?`} onConfirm={() => this.onChangeStatus(record)} okText="确定" cancelText="取消">
                        <Button size="small" type="link" >{record.Status === 1 ? "禁用" : "启用"}</Button>
                    </Popconfirm>
                </div>
            ),
        }];
        this.state = {
            list: [],
            modal: "",
            roleInfo: null,
            menus: [],
            loading: false,
        };
    }

    public componentDidMount() {
        this.getData(this.props);
        getModules().then((data) => {
            this.setState({
                menus: data,
            });
        });
    }

    public getData(props: IRoleProps) {
        const { query } = props;
        this.setState({
            loading: true,
        });
        getRoleList(query.n || "").then((data) => {
            this.setState({
                list: data,
                loading: false,
            });
        });
    }

    public onChangeStatus(data: RoleModel) {
        updateRoleStatus(data.ID, data.Status === 1 ? 2 : 1).then(() => {
            message.success("修改成功");
            this.getData(this.props);
        });
    }

    public onShowModal(id: string) {
        this.setState({
            modal: id,
            roleInfo: null,
        });
    }

    public onEdit(record: RoleModel) {
        this.setState({
            modal: "add",
            roleInfo: record,
        });
    }

    public onEditRole(name: string, menus: string, id: number) {
        updateRole(id, name, menus).then(() => {
            this.onShowModal("");
            message.success("修改成功!");
            this.getData(this.props);
        });
    }

    public onAddRole(name: string, menus: string) {
        newRole(name, menus).then(() => {
            this.onShowModal("");
            message.success("添加成功!");
            this.getData(this.props);
        });
    }

    public render() {
        const { list } = this.state;
        return (
            <div>
                <div className={styles.operator}>
                    <Button type="primary" onClick={() => {
                        ADD_KEY++;
                        this.onShowModal("add");
                    }}>创建角色</Button>
                </div>
                <div className={styles.table}>
                    <Table
                        columns={this.columns}
                        dataSource={list}
                        pagination={false}
                        loading={this.state.loading}
                    />
                </div>
                <Drawer
                    title="角色"
                    visible={this.state.modal === "add"}
                    onClose={() => { this.onShowModal(""); }}
                    width={400}
                >
                    <RoleEditView
                        key={this.state.roleInfo ? `role-${this.state.roleInfo.ID}` : ADD_KEY}
                        roleInfo={this.state.roleInfo}
                        menuData={this.state.menus}
                        onAddRole={this.onAddRole}
                        onEditRole={this.onEditRole}
                    />
                </Drawer>
            </div>
        );
    }
}
