import AddMenu from "@components/Menu/AddMenu";
import { DIALOG_TYPE } from "@definitions/global";
import { MenuModel } from "@definitions/menu/menu";
import { IState } from "@definitions/state";
import { RootAction } from "@definitions/types";
import actionCreators from "@models/actions/menu";
import { Button, Divider, Drawer, Icon, message, Popconfirm, Table, Tag } from "antd";
import { ColumnProps } from "antd/lib/table";
import { connect } from "dva";
import React from "react";
import { bindActionCreators, Dispatch } from "redux";
import styles from "./Menu.less";

const actions = actionCreators(true);

interface IMenuProps {
    addMenu: (params: MenuModel) => Promise<void>;
    editMenu: (params: MenuModel) => Promise<void>;
    getMenu: () => Promise<void>;
    deleteMenu: (id: number) => Promise<void>;
    menuList: MenuModel[];
    menuListOrigin: MenuModel[];
}

interface IMenuState {
    showAddDialog: boolean;
    item: MenuModel;
    dialogType: string;
}

// 用于重置AddMenu组件
let ADD_COUNT = 0;

class Menu extends React.Component<IMenuProps, IMenuState> {

    public columns: Array<ColumnProps<MenuModel>>;

    constructor(props: IMenuProps) {
        super(props);
        this.onToggleAddDialog = this.onToggleAddDialog.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onAddSubMenu = this.onAddSubMenu.bind(this);
        this.onEditMenu = this.onEditMenu.bind(this);
        this.state = {
            showAddDialog: false,
            item: new MenuModel(),
            dialogType: DIALOG_TYPE.ADD,
        };
        this.columns = [{
            title: "菜单ID",
            dataIndex: "ID",
            key: "ID",
        }, {
            title: "模块图标",
            dataIndex: "Icon",
            key: "Icon",
            render: (text) => (
                <div>
                    <Icon type={text} />
                </div>
            ),
        }, {
            title: "菜单名称",
            dataIndex: "Name",
            key: "Name",
            render: (text, record) => (<div>
                {record.IsMenu === 1 ? <Tag color="blue">menu</Tag> : <Tag color="magenta">api</Tag>}
                {text}
            </div>),
        }, {
            title: "链接地址",
            dataIndex: "URL",
            key: "URL",
        }, {
            title: "操作",
            key: "operator",
            render: (text, item) => {
                return (
                    <div className={styles.operators}>
                        <Button type="link" size="small" onClick={() => { this.onAddSubMenu(item); }}>添加子菜单</Button>
                        <Divider type="vertical" />
                        <Button type="link" size="small" onClick={() => { this.onEditMenu(item); }}>编辑</Button>
                        <Popconfirm
                            title={`确定要删除菜单"${item.Name}"吗?`}
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                                this.onDelete(item.ID);
                            }}
                        >
                            <Button size="small" type="link">删除菜单</Button>
                        </Popconfirm>
                    </div>
                );
            },
        }];
    }

    public componentDidMount() {
        this.getData();
    }

    public getData() {
        this.props.getMenu();
    }

    public onAddSubMenu(item: MenuModel) {
        const t = new MenuModel();
        t.ParentID = item.ID || 0;
        t.ID = item.ID;
        this.setState({
            item: t,
        });
        this.onToggleAddDialog(true, DIALOG_TYPE.ADD);
    }

    public onEditMenu(item: MenuModel) {
        this.setState({
            item,
        });
        this.onToggleAddDialog(true, DIALOG_TYPE.EDIT);
    }

    public onToggleAddDialog(show: boolean, type?: string) {
        this.setState({
            showAddDialog: show,
            dialogType: type || this.state.dialogType,
        });
    }

    public onAdd(values: MenuModel) {
        const p = () => {
            // success
            this.onToggleAddDialog(false);
            this.getData();
            message.success(this.state.dialogType === DIALOG_TYPE.ADD ? "添加成功！" : "编辑成功！");
        };
        if (this.state.dialogType === DIALOG_TYPE.ADD) {
            this.props.addMenu(values).then(p).then(() => {
                // reset add dialog when successfully added.
                ADD_COUNT++;
            });
        } else if (this.state.dialogType === DIALOG_TYPE.EDIT) {
            this.props.editMenu(values).then(p);
        }
    }

    public onDelete(id?: number) {
        if (!id) {
            return;
        }
        this.props.deleteMenu(id).then(() => {
            this.getData();
            message.success("删除成功！");
        });
    }

    public render() {
        const { menuList: data, menuListOrigin: originData } = this.props;
        const addMenuKey = `${this.state.dialogType}-${this.state.item.ID}-${ADD_COUNT}`;
        return (
            <div>
                <div className={styles.headerBar}>
                    <Button type="primary" onClick={() => {
                        this.onAddSubMenu(new MenuModel());
                    }} >添加菜单</Button>
                </div>
                <Table
                    className={styles.table}
                    columns={this.columns}
                    rowKey="ID"
                    dataSource={data}
                    pagination={false}
                    childrenColumnName="Children"
                    size="small"
                />
                <Drawer
                    title={this.state.dialogType === DIALOG_TYPE.ADD ? "添加菜单" : "编辑菜单"}
                    width={360}
                    onClose={() => { this.onToggleAddDialog(false); }}
                    visible={this.state.showAddDialog}
                >
                    <AddMenu
                        key={addMenuKey}
                        onSubmit={this.onAdd}
                        originData={originData}
                        current={this.state.item}
                        type={this.state.dialogType}
                    />
                </Drawer>
            </div>
        );
    }
}

const mapStateToProps = ({ menu }: IState) => ({
    menuList: menu.menuList,
    menuListOrigin: menu.menuListOrigin,

});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
    dispatch,
    addMenu: bindActionCreators(actions.addMenu, dispatch),
    getMenu: bindActionCreators(actions.getMenu, dispatch),
    editMenu: bindActionCreators(actions.editMenu, dispatch),
    deleteMenu: bindActionCreators(actions.deleteMenu, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
