import AddLevel from "@components/Level/AddLevel";
import { DEFAULT_PAGE_SIZE } from "@config/constant";
import { DIALOG_TYPE, PagableData, PagableRequest } from "@definitions/global";
import { LevelModel } from "@definitions/level/level";
import { MenuModel, ReqGetMenu } from "@definitions/menu/menu";
import { IState } from "@definitions/state";
import { RootAction } from "@definitions/types";
import actionCreators from "@models/actions/level";
import menuActionCreators from "@models/actions/menu";
import { Button, Drawer, Pagination, Popconfirm, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import React from "react";
import { bindActionCreators, Dispatch } from "redux";
import styles from "./Level.less";

interface ILevelProps {
    dispatch: Dispatch<RootAction>;
    getLevelList: (params: PagableRequest) => Promise<void>;
    getMenu: (params: ReqGetMenu) => Promise<void>;
    addLevel: (params: LevelModel) => Promise<void>;
    editLevel: (params: LevelModel) => Promise<void>;
    removeLevel: (id: number) => Promise<void>;
    levelList: PagableData<LevelModel>;
    menuList: MenuModel[];
    location: Location;
    query: any;
}

interface ILevelState {
    showAddDialog: boolean;
    dialogType: string;
    current: LevelModel;
}

// 用于重置AddLevel组件
let ADD_COUNT = 0;

class Level extends React.Component<ILevelProps, ILevelState> {

    public columns: Array<ColumnProps<LevelModel>>;

    constructor(props: ILevelProps) {
        super(props);
        this.onGoTo = this.onGoTo.bind(this);
        this.getData = this.getData.bind(this);
        this.onToggleAddDialog = this.onToggleAddDialog.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.state = {
            showAddDialog: false,
            current: new LevelModel(),
            dialogType: DIALOG_TYPE.ADD,
        };
        this.columns = [{
            title: "级别ID",
            dataIndex: "Id",
            key: "Id",
        }, {
            title: "级别名称",
            dataIndex: "Name",
            key: "Name",
        }, {
            title: "操作",
            key: "operator",
            render: (text, item) => {
                return (
                    <div className={styles.operators}>
                        <Button size="small" type="primary" onClick={() => { this.onEdit(item); }}>编辑</Button>
                        <Popconfirm
                            title={`确认删除权限级别"${item.Name}"吗?`}
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => { this.onRemove(item.Id || 0); }}
                        >
                            <Button size="small" type="danger">删除</Button>
                        </Popconfirm>
                    </div>
                );
            },
        }];
    }

    public componentDidMount() {
        this.getData();
    }

    public componentWillReceiveProps(nextProps: ILevelProps) {
        if (this.props.query.page !== nextProps.query.page) {
            this.getData(nextProps.query.page);
        }
    }

    public getData(p?: number) {
        const page = p || this.props.query.page || 1;
        this.props.getLevelList({
            Page: page,
        });
    }

    public onGoTo(page: number) {
        const { location } = this.props;
        this.props.dispatch(routerRedux.push(`${location.pathname}?page=${page}`));
    }

    public onToggleAddDialog(show: boolean, type?: string) {
        this.setState({
            showAddDialog: show,
            dialogType: type || this.state.dialogType,
        });
    }

    public onAdd() {
        this.setState({
            current: new LevelModel(),
        });
        this.onToggleAddDialog(true, DIALOG_TYPE.ADD);
    }

    public onEdit(item: LevelModel) {
        this.setState({
            current: item,
        });
        this.onToggleAddDialog(true, DIALOG_TYPE.EDIT);
    }

    public onRemove(id: number) {
        if (!id) {
            return;
        }
        this.props.removeLevel(id).then(() => {
            this.getData();
        });
    }

    public onSubmit(params: LevelModel) {
        const p = () => {
            this.getData();
            this.onToggleAddDialog(false);
        };
        if (this.state.dialogType === DIALOG_TYPE.ADD) {
            this.props.addLevel(params).then(p).then(() => {
                ADD_COUNT++;
            });
        } else if (this.state.dialogType === DIALOG_TYPE.EDIT) {
            this.props.editLevel(params).then(p);
        }
    }

    public render() {
        const { menuList, getMenu, levelList } = this.props;
        const key = `${this.state.dialogType}-${this.state.current.Id}-${ADD_COUNT}`;
        return (
            <div>
                <div>
                    <Button type="primary" onClick={() => { this.onAdd(); }}>创建级别</Button>
                </div>
                <Table
                    columns={this.columns}
                    className={styles.table}
                    dataSource={levelList.Data}
                    pagination={false}
                    rowKey="Id"
                />
                <div className={styles.pagination}>
                    <Pagination
                        total={levelList.Total}
                        current={levelList.Page}
                        pageSize={DEFAULT_PAGE_SIZE}
                        hideOnSinglePage
                        onChange={(page) => { this.onGoTo(page); }}
                    />
                </div>
                <Drawer
                    title={this.state.dialogType === DIALOG_TYPE.ADD ? "添加级别" : "编辑级别"}
                    visible={this.state.showAddDialog}
                    width={360}
                    onClose={() => { this.onToggleAddDialog(false); }}
                >
                    <AddLevel
                        key={key}
                        current={this.state.current}
                        menuList={menuList}
                        getMenu={getMenu}
                        onSubmit={this.onSubmit}
                        type={this.state.dialogType}
                    />
                </Drawer>
            </div>
        );
    }
}

const actions = actionCreators(true);

const mapStateToProps = ({ menu, level, home }: IState) => ({
    menuList: menu.menuList,
    levelList: level.levelList,
    query: home.query,
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
    dispatch,
    getLevelList: bindActionCreators(actions.getLevelList, dispatch),
    addLevel: bindActionCreators(actions.addLevel, dispatch),
    editLevel: bindActionCreators(actions.editLevel, dispatch),
    removeLevel: bindActionCreators(actions.removeLevel, dispatch),
    getMenu: bindActionCreators(menuActionCreators(true).getMenu, dispatch),

});

export default connect(mapStateToProps, mapDispatchToProps)(Level);
